import csv
import psycopg2
from decimal import Decimal
import re

# --- CONFIGURATION ---
CSV_FILE = "test_data.csv"  # your CSV path
SHOP_ID = "02b0dbda-c400-4083-8d27-d2cc9f2b69c8"  # replace with your shop's UUID
DB_CONFIG = {
    "dbname": "cardshop",
    "user": "hsiya_user",
    "password": "123",
    "host": "localhost",
    "port": 5432
}

# --- Connect to Postgres ---
conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()

# --- Helper to convert price to cents ---
def price_to_cents(price_str):
    try:
        return int(Decimal(price_str) * 100)
    except:
        return None

# --- Clean card names ---
def clean_card_name(name):
    """
    Remove trailing printing info in parentheses.
    e.g. "Hunting Velociraptor (Borderless) (Universes Beyond: Jurassic World Collection)"
    becomes "Hunting Velociraptor"
    """
    return re.sub(r'\s*\(.*\)$', '', name).strip()

# --- Condition mapping ---
condition_map = {
    "Near Mint": "NM",
    "Lightly Played": "LP",
    "Moderately Played": "MP",
    "Heavily Played": "HP",
    "Damaged": "DMG"
}

# --- Read CSV and import ---
with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Only import Magic cards
        if row["Product Line"] != "Magic":
            continue

        # Clean name & set
        card_name_raw = row["Product Name"].strip()
        card_name = clean_card_name(card_name_raw)
        set_name = row["Set Name"].strip()

        # Find matching card in cards table (default printing)
        cur.execute("""
            SELECT id FROM cards
            WHERE name = %s
            ORDER BY released_at ASC, id ASC
            LIMIT 1
        """, (card_name,))
        card_row = cur.fetchone()

        if not card_row:
            print(f"Card not found in DB: {card_name_raw} ({set_name})")
            continue

        card_id = card_row[0]

        # --- Process condition ---
        condition_raw = row.get("Condition", "").strip()
        # Remove trailing "Foil" if present
        condition_raw = re.sub(r'\s*Foil$', '', condition_raw)
        # Remove language suffix if present (e.g., " - Japanese")
        condition_raw = re.sub(r'\s*-\s*\w+$', '', condition_raw)
        condition = condition_map.get(condition_raw, None)
        if not condition:
            print(f"Skipping row with unknown condition: {row.get('Condition')}")
            continue

        # --- Process quantity & price ---
        quantity = int(row.get("Total Quantity", 0)) + int(row.get("Add to Quantity", 0))
        price_cents = price_to_cents(row.get("My Store Price") or row.get("TCG Marketplace Price"))

        # --- Insert or update shop_cards ---
        cur.execute("""
            INSERT INTO shop_cards (shop_id, card_id, quantity, price_cents, condition)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (shop_id, card_id)
            DO UPDATE SET
                quantity = EXCLUDED.quantity,
                price_cents = EXCLUDED.price_cents,
                condition = EXCLUDED.condition
        """, (SHOP_ID, card_id, quantity, price_cents, condition))

# --- Commit and close ---
conn.commit()
cur.close()
conn.close()

print("CSV import complete!")
