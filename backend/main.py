import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import database
from database import Supplier, get_db
from agent import run_supplier_scout

# Load environment variables
load_dotenv()

app = FastAPI(title="Zalion Supplier Scout")

# CORS - Get origins from environment variable
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
# Support comma-separated list or single value
if cors_origins_str == "*":
    cors_origins = ["*"]
else:
    cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB
@app.on_event("startup")
def on_startup():
    database.init_db()

# Models
class SearchRequest(BaseModel):
    query: str

class SupplierCreate(BaseModel):
    name: str
    website: Optional[str] = None
    relevance_score: Optional[float] = 0.0
    notes: Optional[str] = None

class SupplierResponse(SupplierCreate):
    id: int
    class Config:
        orm_mode = True

# Endpoints
@app.post("/search")
def search_suppliers(request: SearchRequest):
    """
    Triggers the AI agent to search for suppliers.
    """
    results = run_supplier_scout(request.query)
    return results

@app.post("/suppliers", response_model=SupplierResponse)
def save_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    """
    Saves a supplier to the database.
    """
    db_supplier = Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@app.get("/suppliers", response_model=List[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    """
    List all saved suppliers.
    """
    return db.query(Supplier).all()
