from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class PasswordItem(Base):
    __tablename__ = "password_items"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
    )

    encrypted_data: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    iv: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    salt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )