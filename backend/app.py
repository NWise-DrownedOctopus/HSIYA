from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from .database import SessionLocal
from .models import ShopCard, Card, Shop
from .deps import get_db
from .routes.auth import router as auth_router

import logging

app = FastAPI()

# Enable CORS for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# ---------------------------
# Get a specific card by its ShopCard ID
# ---------------------------
@app.get("/shop_cards/{shop_card_id}")
def get_shop_card(shop_card_id: str, db: Session = Depends(get_db)):
    try:
        shop_card = db.query(ShopCard).join(Card).filter(ShopCard.id == shop_card_id).first()
        if not shop_card:
            raise HTTPException(status_code=404, detail="Shop card not found")

        card = shop_card.card

        # Extract a photo URL from the new image_uris JSON
        photo_url = None
        if card.image_uris:
            photo_url = card.image_uris.get("normal")  # or "small" / "large" depending on preference

        return {
            "shop_card_id": shop_card.id,
            "name": card.name,
            "set": card.set_name,
            "quantity": shop_card.quantity,
            "price_cents": shop_card.price_cents,
            "condition": shop_card.condition,
            "photo_url": photo_url,
        }

    except Exception as e:
        logging.exception("Error fetching shop card")
        raise HTTPException(status_code=500, detail=str(e))



# ---------------------------
# Search shop_cards by card name
# ---------------------------
@app.get("/shop_cards")
def search_shop_cards(q: str = Query(None, min_length=1), db: Session = Depends(get_db)):
    if not q:
        return []

    try:
        q_lower = f"%{q.lower()}%"
        results = (
            db.query(ShopCard)
            .join(Card, ShopCard.card_id == Card.id)
            .filter(Card.name.ilike(q_lower))
            .limit(10)
            .all()
        )

        response = []
        for shop_card in results:
            card = shop_card.card
            # Use image_uris JSON
            image_url = card.image_uris.get("normal") if card.image_uris else None

            response.append({
                "shop_card_id": shop_card.id,
                "name": card.name,
                "set": card.set_name,
                "quantity": shop_card.quantity,
                "price_cents": shop_card.price_cents,
                "condition": shop_card.condition,
                "photo_url": image_url,
            })

        return response

    except Exception as e:
        logging.exception("Error fetching shop cards")
        raise HTTPException(status_code=500, detail=str(e))

