from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Card

import csv # Might be good to get rid of now

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enable CORS for Next.js frontend
### MUST CHANGE AS THIS IS VERY DANGEROUS OUTSIDE OF TESTING ###
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV data into memory, only Magic cards
cards = []
with open("test_data.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row["Product Line"] != "Magic":
            continue

        cards.append({
            "id": int(row["TCGplayer Id"]),
            "name": row["Product Name"],
            "set": row["Set Name"],
            "rarity": row["Rarity"],
            "condition": row["Condition"],
            "market_price": row["TCG Market Price"],
            "tcg_low": row["TCG Low Price"],
            "quantity": row["Total Quantity"],
            "photo_url": row["Photo URL"],
        })

@app.get("/cards/{card_id}")
def get_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    return {
        "id": card.id,
        "name": card.name,
        "set": card.card_set,
        "rarity": card.rarity,
        "condition": card.condition,
        "market_price": card.market_price,
        "tcg_low": card.tcg_low,
        "quantity": card.quantity,
        "photo_url": card.photo_url,
    }


@app.get("/cards")
def get_cards(q: str = Query(None, min_length=1), db: Session = Depends(get_db)):
    if not q:
        return []

    q_lower = f"%{q.lower()}%"
    results = (
        db.query(Card)
        .filter(Card.name.ilike(q_lower))  # case-insensitive match
        .limit(10)
        .all()
    )

    return [
        {
            "id": card.id,
            "name": card.name,
            "set": card.card_set,
            "rarity": card.rarity,
            "condition": card.condition,
            "market_price": card.market_price,
            "photo_url": card.photo_url,
        }
        for card in results
    ]

