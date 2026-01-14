import json
import psycopg2
from psycopg2.extras import execute_values
from tqdm import tqdm  # progress bar

# Helper to clean the data
def clean_card(card):
    def empty_to_none(value):
        if value == "" or value == []:
            return None
        return value

    def clean_json(value):
        return json.dumps(value) if value is not None else None

    return (
        empty_to_none(card.get("name")),
        empty_to_none(card.get("rarity")),
        empty_to_none(card.get("id")),
        empty_to_none(card.get("lang")),
        empty_to_none(card.get("scryfall_uri")),
        empty_to_none(card.get("uri")),
        clean_json(card.get("card_faces")),
        empty_to_none(card.get("cmc")),
        card.get("color_identity") or [],
        card.get("color_indicator") or [],
        empty_to_none(card.get("edhrec_rank")),
        card.get("game_changer"),
        card.get("keywords") or [],
        clean_json(card.get("legalities")),
        empty_to_none(card.get("mana_cost")),
        empty_to_none(card.get("oracle_text")),
        empty_to_none(card.get("power")),
        empty_to_none(card.get("toughness")),
        empty_to_none(card.get("type_line")),
        empty_to_none(card.get("artist")),
        card.get("artist_ids") or [],
        card.get("booster"),
        empty_to_none(card.get("border_color")),
        card.get("finishes") or [],
        empty_to_none(card.get("flavor_name")),
        empty_to_none(card.get("flavor_text")),
        card.get("full_art"),
        card.get("highres_image"),
        empty_to_none(card.get("image_status")),
        clean_json(card.get("image_uris")),
        empty_to_none(card.get("printed_name")),
        empty_to_none(card.get("printed_text")),
        empty_to_none(card.get("printed_type_line")),
        empty_to_none(card.get("released_at")),
        empty_to_none(card.get("set_name")),
        empty_to_none(card.get("set")),
        empty_to_none(card.get("set_id")),
        card.get("textless"),
        card.get("variation"),
        empty_to_none(card.get("oracle_id"))
    )

# Connect to database
conn = psycopg2.connect(
    dbname="cardshop",
    user="hsiya_user",
    password="123",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Load JSON
with open(r"E:\WebDevStuff\HSIYA\backend\default-cards-20260113101013.json", encoding="utf-8") as f:
    cards = json.load(f)

# Filter out cards without an ID
cards = [c for c in cards if c.get("id")]

# Prepare SQL
sql = """
    INSERT INTO cards (
        name, rarity, id, lang, scryfall_uri, uri, card_faces, cmc,
        color_identity, color_indicator, edhrec_rank, game_changer, keywords,
        legalities, mana_cost, oracle_text, power, toughness, type_line,
        artist, artist_ids, booster, border_color, finishes, flavor_name,
        flavor_text, full_art, highres_image, image_status, image_uris,
        printed_name, printed_text, printed_type_line, released_at, set_name,
        set, set_id, textless, variation, oracle_id
    )
    VALUES %s
    ON CONFLICT (id) DO NOTHING
"""

# Insert in chunks to show progress
chunk_size = 500
for i in tqdm(range(0, len(cards), chunk_size), desc="Importing cards"):
    chunk = [clean_card(c) for c in cards[i:i+chunk_size]]
    execute_values(cur, sql, chunk)
    conn.commit()

cur.close()
conn.close()
print(f"Imported {len(cards)} cards successfully!")
