from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Shop(Base):
    __tablename__ = "shops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    cards = relationship("Card", back_populates="shop")

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"))
    name = Column(String, nullable=False)
    card_set = Column(String)
    rarity = Column(String)
    condition = Column(String)
    market_price = Column(Float)
    tcg_low = Column(Float)
    quantity = Column(Integer)
    photo_url = Column(String)

    shop = relationship("Shop", back_populates="cards")
