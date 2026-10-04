from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import PasswordItem
from app.schemas import (
    PasswordItemCreate,
    PasswordItemResponse,
    PasswordItemUpdate,
)


router = APIRouter(
    prefix="/api/password-items",
    tags=["Password Items"],
)


@router.get(
    "",
    response_model=list[PasswordItemResponse],
)
async def get_password_items(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PasswordItem)
        .order_by(PasswordItem.id),
    )

    return result.scalars().all()


@router.post(
    "",
    response_model=PasswordItemResponse,
)
async def create_password_item(
    data: PasswordItemCreate,
    db: AsyncSession = Depends(get_db),
):
    item = PasswordItem(
        encrypted_data=data.encrypted_data,
        iv=data.iv,
        salt=data.salt,
    )

    db.add(item)

    await db.commit()
    await db.refresh(item)

    return item


@router.put(
    "/{item_id}",
    response_model=PasswordItemResponse,
)
async def update_password_item(
    item_id: int,
    data: PasswordItemUpdate,
    db: AsyncSession = Depends(get_db),
):
    item = await db.get(
        PasswordItem,
        item_id,
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Password item not found",
        )

    item.encrypted_data = data.encrypted_data
    item.iv = data.iv
    item.salt = data.salt
    item.created_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(item)

    return item


@router.delete(
    "/{item_id}",
)
async def delete_password_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        delete(PasswordItem)
        .where(PasswordItem.id == item_id),
    )

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Password item not found",
        )

    await db.commit()

    return {
        "status": "ok",
    }