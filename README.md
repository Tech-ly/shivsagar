# ShivSagar Tours (Next.js Version)

A premium travel website built with Next.js, Tailwind CSS, and a local JSON database.

## Features

- **4K Hero Section**: Premium visual appeal.
- **Search & Filter**: Filter packages by State (Goa, Rajasthan, etc.) and Price.
- **Dynamic Packages**: Add/Remove packages via Admin Panel.
- **Cart System**: Works without login (LocalStorage based).
- **Authentication**: User Register/Login + Secure Admin Login.
- **Admin Panel**: Manage Packages, View Inquiries, View Users.

## Setup & Run

1. Navigate to the project directory:

   ```bash
   cd shivsagar
   ```

2. Install dependencies (if not already done):

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Admin Credentials

- **Username**: `Admin`
- **Password**: `Admin@123`
- Login at `/login` to be redirected to `/admin`.

## Database

- content is stored in `data/db.json`.
- Images are in `public/`.
