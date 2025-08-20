# Roxilertask Backend

## Setup Instructions

1. **Create the Database**

   Before running the backend, create the database in MySQL:

   ```sql
   CREATE DATABASE store_rating_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the root of the backend folder with the following variables:

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating_app
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

3. **Install Dependencies**

   Run the following command to install all required packages:

   ```sh
   npm install
   ```

4. **Run the Backend**

   Start the backend server:

   ```sh
   npm run dev
   ```

   The backend will automatically create all required tables and be available at `http://localhost:4000`.

## API Endpoints

- `GET /api/users` - Retrieve all users
- `DELETE /api/users/:user_id` - Delete a user
- `GET /api/stores` - Retrieve all stores
- `POST /api/stores` - Add a new store
- `PUT /api/stores/:store_id` - Update a store
- `DELETE /api/stores/:store_id` - Delete a store
- `GET /api/ratings` - Retrieve all ratings
- `POST /api/ratings` - Add a new rating
- `DELETE /api/ratings/:rating_id` - Delete a rating


# ER Diagram 


             ┌───────────────┐
             │    users      │
             ├───────────────┤
             │ PK user_id    │
             │ name          │
             │ email         │
             │ password_hash │
             │ address       │
             │ role          │
             │ created_at    │
             └───────┬───────┘
                     │ 1
                     │
                     │ owns
                     │
                     ▼ N
             ┌───────────────┐
             │    stores     │
             ├───────────────┤
             │ PK store_id   │
             │ name          │
             │ email         │
             │ address       │
             │ category      │
             │ phone         │
             │ description   │
             │ image_url     │
             │ rating        │
             │ reviewCount   │
             │ FK owner_id   │
             │ created_at    │
             └───────┬───────┘
                     │ 1
                     │
                     │ has
                     │
                     ▼ N
             ┌───────────────┐
             │   ratings     │
             ├───────────────┤
             │ PK rating_id  │
             │ FK user_id    │
             │ FK store_id   │
             │ rating_value  │
             │ comment       │
             │ created_at    │
             │ updated_at    │
             └───────────────┘

## Notes
- Make sure MySQL is running and accessible.
- The backend will handle table creation automatically on first run.
- Use the provided API endpoints for all CRUD operations.
- **The very first registered user will automatically be assigned the Admin role.**
