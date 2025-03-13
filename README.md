# User Registration and Verification Application (Zagol task)

This application provides user registration functionality with email verification. After registration, users receive a confirmation email with a verification link. Once verified, users can update their profile information, including their name and profile picture.

---

## Features

1. **User Registration**:
   - Users can register with their email and password.
   - Passwords are hashed before being stored in the database.

2. **Email Verification**:
   - After registration, users receive a confirmation email with a verification link.
   - Clicking the link verifies the user's email address.

3. **Profile Management**:
   - Verified users can update their name and profile picture.
   - Profile pictures are uploaded to a free image hosting service (e.g., ImgBB).

4. **Database**:
   - Uses a local PostgreSQL database to store user information.

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (local installation)
- [pnpm](https://pnpm.io/) (package manager)

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yohannestakata/zagol-task.git
cd zagol-task
```

### 2. Install Dependencies

Install dependencies for both the frontend and backend:

```bash
cd server
pnpm install

cd ../client
pnpm install
```

### 3. Set Up PostgreSQL Database

1. **Install PostgreSQL Locally**:
   - Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).
   - During installation, set a password for the default `postgres` user.

2. **Create a Database**:
   - Open the PostgreSQL command-line tool (`psql`).
   - Run the following commands to create a database and user:

     ```sql
     CREATE DATABASE zagol_task;
     CREATE USER zagol_user WITH PASSWORD 'your_password';
     GRANT ALL PRIVILEGES ON DATABASE zagol_task TO zagol_user;
     ```

3. **Update Environment Variables**:
   - Update the `DATABASE_URL` in the `.env` file (see below).

---

### 4. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://zagol_user:your_password@localhost:5432/zagol_task"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key"

# Email Configuration (for Ethereal)
EMAIL_USER="your_ethereal_email"
EMAIL_PASSWORD="your_ethereal_password"

# Frontend URL
BASE_URL="http://localhost:3001"

# ImgBB API Key (for image uploads)
IMGBB_API_KEY="your_imgbb_api_key"
```

#### Notes:
- **Ethereal**: Sign up at [Ethereal](https://ethereal.email/) to get a test email account.
- **ImgBB**: Sign up at [ImgBB](https://imgbb.com/) to get an API key for image uploads.

---

### 5. Run the Application

#### Backend (NestJS)
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Start the backend server:
   ```bash
   pnpm start
   ```
   The backend will run on `http://localhost:3000`.

#### Frontend (Next.js)
1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Start the frontend server:
   ```bash
   pnpm dev
   ```
   The frontend will run on `http://localhost:3001`.

---

## Testing the Application

### 1. Register a User
- Open the frontend at `http://localhost:3001`.
- Fill out the registration form with an email and password.
- Submit the form.

### 2. Verify Email
- Check your Ethereal inbox at [https://ethereal.email/](https://ethereal.email/).
- Open the confirmation email and click the verification link.

### 3. Update Profile
- After verification, you will be redirected to the profile page.
- Update your name and upload a profile picture.
- Click "Save Changes" to update your profile.

---

## API Endpoints

### Backend (NestJS)
- **POST `/auth/register`**: Register a new user.
- **POST `/auth/verify`**: Verify a user's email using the token.
- **GET `/auth/user/:id`**: Fetch user data by ID.
- **PUT `/auth/user/:id`**: Update user profile (name and profile picture).

### Frontend (Next.js)
- **`/`**: Registration page.
- **`/waiting`**: Waiting page after registration.
- **`/user/:id`**: User profile page.

---

## Technologies Used

- **Backend**:
  - NestJS
  - Prisma (ORM)
  - PostgreSQL (database)
  - bcrypt (password hashing)
  - jsonwebtoken (JWT for email verification)
  - nodemailer (email sending)

- **Frontend**:
  - Next.js
  - Tailwind CSS (styling)
  - Axios (HTTP requests)
  - react-hot-toast (notifications)

---

## Troubleshooting

### 1. Database Connection Issues
- Ensure PostgreSQL is running locally.
- Verify the `DATABASE_URL` in the `.env` file is correct.

### 2. Email Not Sending
- Check your Ethereal credentials in the `.env` file.
- Ensure the email service is properly configured in `auth.service.ts`.

### 3. Image Upload Issues
- Verify the ImgBB API key in the `.env` file.
- Ensure the image file is valid and within the size limit.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [NestJS](https://nestjs.com/) for the backend framework.
- [Next.js](https://nextjs.org/) for the frontend framework.
- [Ethereal](https://ethereal.email/) for test email services.
- [ImgBB](https://imgbb.com/) for free image hosting.
