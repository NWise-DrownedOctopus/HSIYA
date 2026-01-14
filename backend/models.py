from sqlalchemy import Column, Integer, String, Float, Boolean, Date, JSON, Text, ForeignKey, ARRAY, Numeric, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid

# --------------------
# Shops
# --------------------
class Shop(Base):
    __tablename__ = "shops"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    # Relationship to shop_cards
    shop_cards = relationship("ShopCard", back_populates="shop")


# --------------------
# Cards (general info)
# --------------------
class Card(Base):
    __tablename__ = "cards"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    rarity = Column(String)
    lang = Column(Text)
    scryfall_uri = Column(Text)
    uri = Column(Text)
    card_faces = Column(JSON)
    cmc = Column(Numeric)
    color_identity = Column(ARRAY(Text))
    color_indicator = Column(ARRAY(Text))
    edhrec_rank = Column(Integer)
    game_changer = Column(Boolean)
    keywords = Column(ARRAY(Text))
    legalities = Column(JSON)
    mana_cost = Column(Text)
    oracle_text = Column(Text)
    power = Column(Text)
    toughness = Column(Text)
    type_line = Column(Text)
    artist = Column(Text)
    artist_ids = Column(ARRAY(Text))
    booster = Column(Boolean)
    border_color = Column(Text)
    finishes = Column(ARRAY(Text))
    flavor_name = Column(Text)
    flavor_text = Column(Text)
    full_art = Column(Boolean)
    highres_image = Column(Boolean)
    image_status = Column(Text)
    image_uris = Column(JSON)
    printed_name = Column(Text)
    printed_text = Column(Text)
    printed_type_line = Column(Text)
    released_at = Column(Date)
    set_name = Column(Text)
    set = Column(Text)
    set_id = Column(UUID(as_uuid=True))
    textless = Column(Boolean)
    variation = Column(Boolean)
    oracle_id = Column(UUID(as_uuid=True))

    # Relationship to shop_cards
    shop_cards = relationship("ShopCard", back_populates="card")


# --------------------
# Shop-specific cards
# --------------------
class ShopCard(Base):
    __tablename__ = "shop_cards"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shop_id = Column(UUID(as_uuid=True), ForeignKey("shops.id"), nullable=False)
    card_id = Column(UUID(as_uuid=True), ForeignKey("cards.id"))
    quantity = Column(Integer, nullable=False, default=0)
    price_cents = Column(Integer, nullable=False, default=0)
    condition = Column(Text)

    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    shop = relationship("Shop", back_populates="shop_cards")
    card = relationship("Card", back_populates="shop_cards")
    
# --------------------
# Users
# --------------------
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    # Shops this user belongs to
    shop_users = relationship("ShopUser", back_populates="user")


# --------------------
# Shop Users (join table)
# --------------------
class ShopUser(Base):
    __tablename__ = "shop_users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shop_id = Column(UUID(as_uuid=True), ForeignKey("shops.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Text, nullable=False)  # admin or staff
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    # Relationships
    shop = relationship("Shop", back_populates="shop_users")
    user = relationship("User", back_populates="shop_users")


# Update the Shop model to reference shop_users
Shop.shop_users = relationship("ShopUser", back_populates="shop")
