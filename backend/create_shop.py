from database import SessionLocal, Base, engine
from models import Shop

# Create tables if not yet created
Base.metadata.create_all(bind=engine)

db = SessionLocal()

default_shop = Shop(
    id=1,
    name="Default Shop",
    email="default@example.com",
    password_hash="defaultpassword"  # hash if you plan to use login later
)

db.add(default_shop)
db.commit()
db.close()
