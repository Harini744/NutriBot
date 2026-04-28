# NutriEats – AI-Powered Food Ordering App

Full-stack food ordering app with AI recommendations and chatbot.

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (Motor async driver)
- **Auth**: JWT (python-jose + bcrypt)

---

## Project Structure

```
food-ordering-app/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # MongoDB connection
│   ├── seed_data.py         # Sample food data seeder
│   ├── requirements.txt
│   ├── .env                 # Environment variables
│   ├── routers/             # auth, food, cart, orders, recommendations, chatbot
│   ├── models/              # Pydantic schemas
│   └── utils/               # JWT auth + AI engine
└── frontend/
    ├── src/
    │   ├── api/api.js        # Axios API layer
    │   ├── context/          # AuthContext, CartContext
    │   ├── components/       # Navbar, FoodCard, Chatbot
    │   └── pages/            # All 10 pages
    └── package.json
```

---

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running on `localhost:27017`

### Backend

```bash
cd food-ordering-app/backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Seed sample food data
python seed_data.py

# Start server
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd food-ordering-app/frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login, returns JWT |
| GET | /auth/me | Get current user |
| PUT | /auth/me/health-profile | Update health profile |
| GET | /food/ | List foods (search, filter) |
| GET | /food/{id} | Get food detail |
| POST | /food/ | Create food (admin) |
| PUT | /food/{id} | Update food (admin) |
| DELETE | /food/{id} | Delete food (admin) |
| GET | /cart/ | Get user cart |
| POST | /cart/add | Add item to cart |
| PUT | /cart/update | Update item quantity |
| DELETE | /cart/clear | Clear cart |
| POST | /orders/ | Place order |
| GET | /orders/my | Get my orders |
| GET | /orders/admin/all | All orders (admin) |
| PUT | /orders/admin/{id}/status | Update order status (admin) |
| GET | /recommendations/ | AI food recommendations |
| POST | /chatbot/ | Chat with NutriBot |

---

## Creating an Admin User

After registering, manually set `is_admin: true` in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "admin@example.com" }, { $set: { is_admin: true } })
```

---

## AI Features

### Recommendation Engine (`backend/utils/ai.py`)
Rule-based scoring system that ranks foods by:
- Health goal alignment (weight loss → low calorie, high protein → protein-rich, etc.)
- Diet type match (vegan, keto, etc.)
- Allergy exclusion
- Past order history boost
- Calorie goal proximity

### NutriBot Chatbot
Keyword-matching chatbot that handles questions about:
- Calories, protein, carbs
- Vegan, keto, diabetic-friendly options
- Weight loss tips
- Navigation help
