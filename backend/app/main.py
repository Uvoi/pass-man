from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.password_items import router as password_items_router


app = FastAPI(
    title="PassMan API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(password_items_router)


@app.get("/api/health")
async def health_check(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        text("SELECT 1"),
    )

    return {
        "status": "ok",
        "database": result.scalar() == 1,
    }