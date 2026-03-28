# LocalLink - Comprehensive Project Documentation

LocalLink is a multi-role service platform designed to connect local service providers (plumbers, electricians, cleaners, etc.) with customers in their vicinity. The platform features separate interfaces for **Users (Customers)**, **Service Providers**, and **Administrators**.

---

## 🚀 Technology Stack

### 🛠️ Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MySQL (via `mysql2` v3.20.0)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs for password hashing.
- **Security**: Helmet, CORS, and Express Rate Limit.
- **Logging**: Morgan for HTTP request logging.

### 📱 Mobile Application
- **Framework**: React Native with Expo (SDK 55)
- **Navigation**: React Navigation (Drawer, Stack, Bottom Tabs)
- **State Management**: Redux Toolkit (v2.11.2)
- **UI & Animations**: React Native Reanimated (v4.2.1), Expo Linear Gradient, Expo Blur.
- **Network Stack**: Axios for API interaction.
- **Form Handling**: Formik & Yup for validation.

---

## 📂 Project Structure

```text
LocalLink/
├── backend/                # Express API Server
│   ├── src/
│   │   ├── config/         # Database and app configurations
│   │   ├── controllers/    # Business logic for API endpoints
│   │   ├── middlewares/    # Custom middlewares (Auth, error handling)
│   │   ├── models/         # Database schema and model logic
│   │   ├── routes/         # Route definitions
│   │   └── index.js        # Server entry point
│   └── database/           # DB scripts and migrations
└── LocalHubMobile/         # React Native Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── config/         # API URLs and global constants
    │   ├── hooks/          # Custom React hooks
    │   ├── navigation/     # Navigation configuration
    │   ├── screens/        # App screens (User, Provider, Admin, Auth)
    │   ├── services/       # Axios API services
    │   ├── store/          # Redux slices and store configuration
    │   ├── styles/         # Global styles/theme
    │   └── utils/          # Helper functions
    └── App.js              # Root application component
```

---

## ⚙️ Backend Components

### 🗄️ Models (`backend/src/models`)
- `userModel.js`: Manages user profiles (Customers, Providers, Admins).
- `businessModel.js`: Business listing details (name, category, description, etc.).
- `bookingModel.js`: Handles service appointments and orders.
- `leadModel.js`: Manages service queries/leads for providers.
- `reviewModel.js`: Customer feedback and ratings.
- `categoryModel.js`: Service category management.

### 🎮 Controllers (`backend/src/controllers`)
- `authController.js`: Login, registration, and user session management.
- `businessController.js`: CRUD operations for service listings.
- `bookingController.js`: Logic for creating and updating bookings.
- `reviewController.js`: Review submission and retrieval logic.
- `adminController.js`: Administrative tools (approvals, reports).
- `leadController.js`: Logic for managing and buying leads for providers.

### 🛣️ Routes (`backend/src/routes`)
Each route is protected by authentication middleware where necessary:
- `authRoutes.js`: Login/Register.
- `businessRoutes.js`: Listing management.
- `bookingRoutes.js`: Appointments & Orders.
- `reviewRoutes.js`: Ratings & Reviews.
- `categoryRoutes.js`: Discovery routes.
- `adminRoutes.js`: Restricted admin-only endpoints.

---

## 🗄️ Database Schema & Table Information

The project uses a MySQL database (`localhub_db`). Below are the detailed table definitions:

### 1. `users`
Stores all account types (Customers, Providers, Admins).
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique identifier. |
| `name` | VARCHAR(255) | Full name of the user. |
| `email` | VARCHAR(255) | Unique email address (used for login). |
| `password` | VARCHAR(255) | Hashed password (bcrypt). |
| `role` | ENUM | 'user', 'provider', 'admin'. |
| `phone` | VARCHAR(20) | Contact number. |
| `status` | ENUM | 'active', 'inactive', 'suspended'. |
| `created_at` | TIMESTAMP | Creation time. |

### 2. `categories`
Service categories for classification.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique identifier. |
| `name` | VARCHAR(100) | Category name (e.g., Plumbing). |
| `icon` | VARCHAR(100) | Icon name for the UI. |
| `slug` | VARCHAR(100) | URL-friendly name. |
| `color` | VARCHAR(20) | HEX code for UI branding. |

### 3. `businesses`
Detailed listings for service providers.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique identifier. |
| `provider_id` | INT (FK) | Links to `users.id`. |
| `category_id` | INT (FK) | Links to `categories.id`. |
| `name` | VARCHAR(255) | Business name. |
| `description` | TEXT | Detailed service description. |
| `address` | VARCHAR(255) | Physical location. |
| `rating` | DECIMAL(2,1) | Average user rating (0-5). |
| `is_verified` | TINYINT(1) | Approval status (0 = Pending, 1 = Verified). |

### 4. `bookings`
Customer appointments.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique identifier. |
| `user_id` | INT (FK) | Links to `users.id` (Customer). |
| `business_id` | INT (FK) | Links to `businesses.id`. |
| `booking_date` | DATE | Date of service. |
| `booking_time` | TIME | Time of service. |
| `status` | ENUM | 'pending', 'confirmed', 'completed', 'cancelled'. |

### 5. `leads`
Queries sent from users to providers.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique identifier. |
| `business_id` | INT (FK) | Target business. |
| `customer_name`| VARCHAR(255) | Name of the lead sender. |
| `message` | TEXT | Inquiry details. |

---

## 🛠️ Utility & Maintenance Scripts

Inside the `backend/` directory, there are several scripts for maintenance:
- `check_schema.js`: Validates the current DB against the expected schema.
- `fix_db.js`: Corrects common database inconsistencies.
- `seed.sql`: Populates the database with initial mock data for testing.
- `fix_icons.js`: Normalizes category icons for the mobile UI.

---

## 🔐 Authentication Flow

1. **Registration/Login**: Handled via `authController.js`. Passwords are encrypted before storage.
2. **Token Generation**: On successful login, a JWT is generated containing the `userId` and `role`.
3. **Protected Routes**: The backend uses an `authMiddleware.js` to verify the JWT in the `Authorization` header (`Bearer <token>`).
4. **Role Authorization**: Specific routes check if the user role matches (e.g., only 'admin' can access `/admin/*`).

---

## 🌐 Main API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Create a new account. | No |
| POST | `/api/auth/login` | Log in and get token. | No |
| GET | `/api/categories` | List all service categories. | No |
| GET | `/api/business` | Search/Browse businesses. | No |
| POST | `/api/bookings` | Create a service booking. | Yes |
| GET | `/api/admin/pending` | View businesses awaiting approval. | Yes (Admin) |

---

## 📱 Mobile App Breakdown

### 🧭 Navigation (`src/navigation`)
The app uses a nested navigation structure:
- **`AppNavigator`**: The root navigator that switches between Auth, User, Provider, and Admin flows.
- **`MainDrawerNavigator`**: Provides side-bar access for help, settings, and profile.
- **`UserNavigator`**: Tab-based navigation for customers (Home, Nearby, Bookings, Profile).
- **`ProviderNavigator`**: Dashboard-focused navigation for service providers (Leads, My Listings, Earnings).
- **`AdminNavigator`**: Dashboard for managing the entire platform.

### 📺 Core Screens (`src/screens`)

#### 👤 User (Customer) Screens:
- `HomeScreen.js`: Service discovery and search.
- `CategoriesScreen.js`: Explore services by type.
- `SubcategoryScreen.js`: Refined search results.
- `BusinessDetailsScreen.js`: View service details and book.
- `RequestsScreen.js`: Track service history.
- `FavoritesScreen.js`: Saved listings.

#### 🔧 Provider Screens:
- `DashboardScreen.js`: Statistical overview of earnings and leads.
- `LeadsScreen.js`: Available customer queries.
- `AddBusinessScreen.js`: Creating new service listings.
- `ReviewsScreen.js`: Managing customer feedback.
- `EarningsScreen.js`: Financial monitoring.
- `ChatListScreen.js`: Direct communication with customers.

#### 👑 Admin Screens:
- `DashboardScreen.js`: Platform-wide stats.
- `ApprovalsScreen.js`: Verifying new provider listings.
- `UsersScreen.js`: User management.
- `ReportsScreen.js`: Analytics and compliance.

---

## 💾 State Management (Redux)
- **`store/`**: Central store configuration.
- **Slices**:
  - `authSlice.js`: Manages user authentication state and tokens.
  - `userSlice.js`: Stores user-specific data and preferences.
  - `businessSlice.js`: Handles listings and search results.
  - `leadSlice.js`: Manages providers' leads.

---

## 📦 Setup & Installation

### Backend
1.  Navigate to `/backend`.
2.  Install dependencies: `npm install`.
3.  Set up environment variables in a `.env` file (DB_HOST, DB_USER, DB_PASS, JWT_SECRET).
4.  Run the server: `npm run dev`.

### Mobile App
1.  Navigate to `/LocalHubMobile`.
2.  Install dependencies: `npm install`.
3.  Configure `API_URL` in `src/config/apiConfig.js`.
4.  Start Expo: `npx expo start`.
