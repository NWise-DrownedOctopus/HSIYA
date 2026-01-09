import csv
from sqlalchemy.orm import Session
from models import Card, Shop
from database import SessionLocal

db = SessionLocal()

# Ensure a default shop exists
default_shop = db.query(Shop).filter(Shop.id == 1).first()
if not default_shop:
    default_shop = Shop(
        id=1,
        name="Default Shop",
        email="default@example.com",  # non-null required
        password_hash="changeme"      # placeholder
    )
    db.add(default_shop)
    db.commit()

with open("test_data.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row["Product Line"] != "Magic":
            continue
        card = Card(
            id=int(row["TCGplayer Id"]),
            name=row["Product Name"],
            card_set=row["Set Name"],        # renamed
            rarity=row["Rarity"],
            condition=row.get("Condition"),  # new field
            market_price=float(row["TCG Market Price"] or 0),
            tcg_low=float(row.get("TCG Low Price") or 0),  # new field
            quantity=int(row["Total Quantity"] or 0),
            photo_url=row.get("Photo URL"),  # new field
            shop_id=1
        )
        db.add(card)

db.commit()
db.close()
