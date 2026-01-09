from database import Base, engine

# Drop all tables (danger: deletes data!)
Base.metadata.drop_all(bind=engine)

# Recreate all tables according to your current models
Base.metadata.create_all(bind=engine)
