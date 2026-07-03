# Food Ordering Platform

## Project Description

A full-stack food ordering platform with separate user and admin workflows. The backend is built with FastAPI and SQLAlchemy, while the frontend is a React + Vite application styled with Tailwind CSS. The system supports user registration, login, menu browsing, cart management, order placement, admin menu management, order processing, analytics, image uploads via Cloudinary, and AI-powered menu search using Gemini.

## Features

- User registration, login, profile view
- Admin registration, login, profile view
- JWT-based authentication with separate user/admin access controls
- Menu browsing and filtering
- Cart management and order checkout
- Admin menu item creation, editing, deletion, and availability control
- Order status updates and admin order management
- Dashboard and analytics endpoints for admin
- Cloudinary image uploads for menu items
- AI search endpoint to extract food filters from natural language

## User Features

- Register and log in as a user
- Browse all menu items
- Add items to cart
- View cart contents and clear cart
- Place orders with a delivery location
- View user orders and order history
- Browse menu by search and category filters

## Admin Features

- Register and log in as an admin
- View admin profile and menu items
- Create, edit, delete menu items
- Toggle menu item availability
- View incoming orders and update order status
- Access analytics endpoints for dashboard data

## Technology Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router DOM, Axios
- Backend: FastAPI, SQLAlchemy, Pydantic, Uvicorn
- Database: PostgreSQL (via `DATABASE_URL`)
- Authentication: JWT tokens with `python-jose`
- Image Uploads: Cloudinary
- AI Search: Google Gemini (`google-genai` client)

## Project Architecture

- Frontend communicates with backend via REST API using `axios`.
- The frontend stores JWT tokens in `localStorage` and sends them in `Authorization: Bearer` headers.
- Backend uses FastAPI routers for modular endpoint grouping.
- SQLAlchemy manages database models, relationships, and sessions.
- The backend reads configuration from a `.env` file.
- FastAPI automatically exposes OpenAPI/Swagger docs at `/docs` and `/redoc`.

## Folder Structure

```text
Food-Ordering-Platform/
├─ Backend/
│  ├─ .env
│  ├─ .gitignore
│  ├─ alembic.ini
│  ├─ requirements.txt
│  ├─ alembic/
│  │  ├─ env.py
│  │  ├─ README
│  │  ├─ script.py.mako
│  │  └─ versions/
│  │     ├─ 3b2e40e2252a_initial_tables.py
│  │     └─ f1283e8b68e4_add_selected_location_to_orders.py
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ core/
│  │  │  ├─ cloudinary.py
│  │  │  ├─ config.py
│  │  │  └─ security.py
│  │  ├─ database/
│  │  │  ├─ base.py
│  │  │  └─ database.py
│  │  ├─ dependencies/
│  │  │  └─ auth.py
│  │  ├─ models/
│  │  │  ├─ admin.py
│  │  │  ├─ cart.py
│  │  │  ├─ cart_item.py
│  │  │  ├─ category.py
│  │  │  ├─ menu_item.py
│  │  │  ├─ order.py
│  │  │  ├─ order_item.py
│  │  │  └─ user.py
│  │  ├─ routers/
│  │  │  ├─ admin.py
│  │  │  ├─ ai.py
│  │  │  ├─ analytics.py
│  │  │  ├─ auth.py
│  │  │  ├─ cart.py
│  │  │  ├─ dashboard.py
│  │  │  ├─ menu_item.py
│  │  │  ├─ order.py
│  │  │  ├─ upload.py
│  │  │  └─ user.py
│  │  ├─ schemas/
│  │  │  ├─ admin.py
│  │  │  ├─ cart.py
│  │  │  ├─ menu_item.py
│  │  │  ├─ order.py
│  │  │  ├─ profile.py
│  │  │  ├─ token.py
│  │  │  └─ user.py
│  │  ├─ services/
│  │  │  ├─ admin_service.py
│  │  │  ├─ ai_service.py
│  │  │  ├─ analytics_service.py
│  │  │  ├─ auth_service.py
│  │  │  ├─ cart_service.py
│  │  │  ├─ dashboard_service.py
│  │  │  ├─ menu_service.py
│  │  │  ├─ order_service.py
│  │  │  └─ user_service.py
│  │  └─ utils/
│  │     └─ auth.py
│  └─ uploads/
├─ Frontend/
│  ├─ .env
│  ├─ .gitignore
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  ├─ index.css
│  │  ├─ components/
│  │  ├─ context/
│  │  └─ pages/
└─ README.md
```

## Installation Guide

### Backend Setup

1. Open a terminal in `Backend/`.
2. Create and activate a Python virtual environment:

```bash
python -m venv venv
venv\Scripts\Activate.ps1  # PowerShell
# or
venv\Scripts\activate.bat  # CMD
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in `Backend/` with the required environment variables.
5. Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Open a terminal in `Frontend/`.
2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

4. The frontend uses `VITE_BASE_URL` to connect to the FastAPI backend.

## Environment Variables

### Backend

The backend reads configuration from `Backend/.env` using `pydantic_settings.BaseSettings`.

- `DATABASE_URL` — PostgreSQL database connection string
- `SECRET_KEY` — JWT signing secret
- `ALGORITHM` — JWT algorithm (e.g. `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` — token lifetime in minutes
- `CLOUD_NAME` — Cloudinary cloud name
- `API_KEY` — Cloudinary API key
- `API_SECRET` — Cloudinary API secret
- `GEMINI_API_KEY` — Google Gemini API key used by the AI search service

### Frontend

The frontend uses:

- `VITE_BASE_URL` — backend URL, currently `http://127.0.0.1:8000`

## Database Information

The backend uses SQLAlchemy with PostgreSQL and the following tables:

- `users`
- `admins`
- `categories`
- `menu_items`
- `carts`
- `cart_items`
- `orders`
- `order_items`

### Model relationships

- `User` has one `Cart` and many `Order`
- `Admin` has many `MenuItem` and many `Order`
- `Category` has many `MenuItem`
- `MenuItem` belongs to `Category` and `Admin`, and has many `CartItem` and `OrderItem`
- `Cart` has many `CartItem`
- `Order` has many `OrderItem`
- `CartItem` belongs to `Cart` and `MenuItem`
- `OrderItem` belongs to `Order` and `MenuItem`

### Schema notes

- Orders store `selected_location`, `status`, and `total_price`
- `status` values include: `Placed`, `Accepted`, `Preparing`, `Delivered`, `Rejected`, `Dispatched`

## Authentication Flow

- Users and admins register/login with separate endpoints.
- Passwords are hashed using `bcrypt` via `passlib`.
- JWT tokens are generated in `app.core.security.create_access_token()`.
- Tokens include `sub` (email) and `role` (`user` or `admin`).
- The backend verifies tokens with `python-jose` and `settings.SECRET_KEY`.
- `get_current_user()` and `get_current_admin()` enforce role-based access.
- The React frontend stores the JWT in `localStorage` and sends it with `Authorization: Bearer <token>`.

## API Documentation

FastAPI exposes automatic OpenAPI docs by default at:

- `/docs` — Swagger UI
- `/redoc` — ReDoc

### Authentication APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/users/register` | Register a new user | No |
| POST | `/users/login` | Login user and receive JWT | No |
| GET | `/users/profile` | Retrieve user profile and orders | User |
| PUT | `/users/profile` | Update user firstname/lastname | User |
| POST | `/admins/register` | Register a new admin | No |
| POST | `/admins/login` | Login admin and receive JWT | No |
| GET | `/admins/profile` | Retrieve admin profile | Admin |
| PUT | `/admins/profile` | Update admin profile | Admin |
| GET | `/admins/items` | Retrieve admin-owned menu items | Admin |

> Note: `Backend/app/routers/auth.py` includes route decorators but does not define body implementations; the actual auth logic is implemented in `user.py` and `admin.py`.

### User APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/users/register` | Create user account | No |
| POST | `/users/login` | Login user and return token | No |
| GET | `/users/profile` | Get user profile, orders, and nested order items | User |
| PUT | `/users/profile` | Update user profile | User |

### Admin APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/admins/register` | Create admin account | No |
| POST | `/admins/login` | Login admin and return token | No |
| GET | `/admins/profile` | Get admin profile | Admin |
| PUT | `/admins/profile` | Update admin profile | Admin |
| GET | `/admins/items` | Get all menu items for current admin | Admin |

### Menu APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/menu/` | Create a menu item | Admin |
| GET | `/menu/` | Get all menu items | No |
| GET | `/menu/admin` | Get menu items for current admin | Admin |
| GET | `/menu/{item_id}` | Get a single menu item by ID | No |
| PUT | `/menu/{item_id}` | Update a menu item | Admin |
| DELETE | `/menu/{item_id}` | Delete a menu item | Admin |
| PATCH | `/menu/{item_id}/availability` | Toggle item availability | Admin |

#### Menu schema examples

`POST /menu/` body:

```json
{
  "name": "Veg Burger",
  "description": "Delicious vegetarian burger",
  "category_id": 2,
  "price": 149.99,
  "image": "https://...",
  "is_vegetarian": true,
  "is_spicy": false,
  "available": true
}
```

`MenuResponse` includes:
- `id`
- `name`
- `description`
- `image`
- `category_id`
- `is_vegetarian`
- `is_spicy`
- `price`
- `available`

### Cart APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/users/cart/add` | Add item to current user cart | User |
| GET | `/users/cart` | Retrieve current user cart | User |
| DELETE | `/users/cart/{cart_item_id}` | Remove item from cart | User |
| DELETE | `/users/cart` | Clear entire cart | User |

`CartAddRequest` schema:

```json
{
  "menu_item_id": 1,
  "quantity": 2
}
```

`CartResponse` schema returns:

```json
{
  "cartItems": [
    {
      "id": 1,
      "menu_item_id": 3,
      "name": "Pizza",
      "image": "...",
      "price": 299.99,
      "quantity": 2,
      "admin_id": 1
    }
  ]
}
```

### Order APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/orders/` | Place an order from current cart | User |
| GET | `/orders/my-orders` | Get current user orders | User |
| GET | `/orders/coming-orders` | Get admin incoming orders | Admin |
| PATCH | `/orders/{order_id}` | Update order status | Admin |
| GET | `/orders/{order_id}/status` | Get order status | User |
| GET | `/orders/history` | Get user order history | User |

`CreateOrder` request body:

```json
{
  "selected_location": "123 Main St, City"
}
```

`UpdateOrderStatus` allowed statuses:
- `Placed`
- `Accepted`
- `Preparing`
- `Delivered`
- `Rejected`
- `Dispatched`

### Analytics APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/dashboard/` | Admin dashboard summary | Admin |
| GET | `/dashboard/popular-items` | Top ordered items | Admin |
| GET | `/dashboard/weekly-earnings` | Revenue per day for the last week | Admin |
| GET | `/analytics/overview` | Analytics overview stats | Admin |
| GET | `/analytics/monthly-revenue` | Revenue by date | Admin |
| GET | `/analytics/order-status` | Order status counts | Admin |
| GET | `/analytics/top-items` | Top selling items | Admin |
| GET | `/analytics/recent-orders` | Recent admin orders | Admin |

### Upload APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/upload/` | Upload an image file to Cloudinary | No |

Request uses `multipart/form-data` with file key `image`.

Response example:

```json
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

### AI APIs

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/ai/search` | Extract search filters from natural language query | No |

#### AI search request example

```json
{
  "query": "I want spicy vegetarian pizza under 250"
}
```

#### Search filter extraction

The AI service uses Gemini to parse requests into filters such as:
- `vegetarian`
- `spicy`
- `max_price`
- `category`

It then filters available `MenuItem` rows based on the extracted values.

## Validation Rules

### Pydantic schemas

- `UserCreate`: requires `first_name`, `last_name`, `email`, `password`
- `UserLogin`: requires `email`, `password`
- `AdminCreate`: requires `restaurant_name`, `first_name`, `last_name`, `email`, `password`
- `AdminLogin`: requires `email`, `password`
- `MenuCreate`: requires `name`, `description`, `category_id`, `price`, `is_vegetarian`, `is_spicy`, optional `image`, optional `available`
- `MenuUpdate`: allows optional each field for partial update
- `CartAddRequest`: requires `menu_item_id`, optional `quantity` (defaults to 1)
- `CreateOrder`: requires `selected_location`
- `UpdateOrderStatus`: accepts only `Placed`, `Accepted`, `Preparing`, `Delivered`, `Rejected`, `Dispatched`

## Frontend and Backend Communication

- The frontend calls backend routes using `axios`.
- Protected requests send the JWT token from `localStorage` in `Authorization: Bearer <token>`.
- Example endpoints from frontend:
  - `GET ${import.meta.env.VITE_BASE_URL}/menu/`
  - `POST ${import.meta.env.VITE_BASE_URL}/users/cart/add`
  - `POST ${import.meta.env.VITE_BASE_URL}/orders/`
  - `POST ${import.meta.env.VITE_BASE_URL}/upload`
  - `POST ${import.meta.env.VITE_BASE_URL}/ai/search`

## Deployment

No dedicated deployment configuration files were found. The project can be deployed by:

1. Building the frontend:

```bash
npm run build
```

2. Running the backend with Uvicorn or a process manager:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

3. Serving built frontend assets with a static server or hosting platform.

## Screenshots

> Add screenshots to `README.md` after capturing the app UI.

- `![Start page](screenshots/start.png)`
- `![User home](screenshots/user-home.png)`
- `![Admin dashboard](screenshots/admin-dashboard.png)`
- `![Order flow](screenshots/order-flow.png)`

## Future Improvements

- Add consistent API response wrappers for all endpoints
- Add server-side category validation and category creation endpoints
- Improve frontend error handling and form validation
- Implement refresh tokens or more robust session management
- Add unit/integration tests for backend and frontend
- Add a real admin dashboard page with charts and summaries
- Support multi-restaurant carts or multi-admin checkout flows more explicitly

## Contributing

Contributions are welcome via pull requests. Please:

1. Fork the repository.
2. Create a feature branch.
3. Submit a PR with a clear description.

## License

No license file was found in the repository, so license terms are not specified.

## Author Information

Author information was not found in the repository.
