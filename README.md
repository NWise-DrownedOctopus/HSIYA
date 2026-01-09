# HSIYA - (HOT SINGLES IN YOUR AREA)

HSIYA is a full-stack web application for recomending MTG singles at local cardshops based on your commander deck.  
It consists of a **FastAPI backend** with a **PostgreSQL database** and a **Next.js 13 frontend** using TailwindCSS.

---

## Backend (FastAPI + PostgreSQL)

- **Purpose:** Serve card data via REST API endpoints.  
- **Core Stack:** FastAPI, SQLAlchemy ORM, PostgreSQL.  
- **Endpoints:**
  - `/cards` – Search cards by name.
  - `/cards/{id}` – Fetch individual card details.
- **Design Decisions:**
  - Database sessions handled via dependency injection (`get_db`).  
  - CORS enabled for frontend development.  

---

## Frontend (Next.js 13 + TailwindCSS)

- **Purpose:** Interactive dashboard for browsing and searching cards.  
- **Core Stack:** Next.js 13 (App Router), TypeScript, TailwindCSS.  
- **Features:**
  - Autocomplete card search with live results from the backend.  
  - Dynamic card detail pages (`/cards/[id]`).  
- **Design Decisions:**
  - Centralized reusable components in `ui/`.  
  - Pages structured with App Router (`app/`) for scalability.

---

## Core Stack Decisions

- **Backend:** FastAPI for async performance and easy REST API creation.  
- **Database:** PostgreSQL for structured card data and relational queries.  
- **Frontend:** Next.js 13 for server-side rendering, routing, and modern React features.  
- **Styling:** TailwindCSS for rapid UI development with utility-first classes.  

---
