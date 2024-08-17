## Chat app
Built using React, Express.js, Socket.io, Drizzle ORM, Supabase

### Login Page
![image](https://github.com/user-attachments/assets/8fda0965-5d4c-45aa-b80c-3a52a92e1871)

### Register Page
![image](https://github.com/user-attachments/assets/aca7f19f-05a8-4418-bb85-8799e8a9044e)

### Main Chat Page
![image](https://github.com/user-attachments/assets/9229aad6-cc2e-4da5-b097-f86ef71dcf73)

### Main Chat Page - Adding for new contact
![image](https://github.com/user-attachments/assets/fe20d7fc-8bdc-483c-ad7b-dcd3510deca1)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- Cloudinary account

  
## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-repo/your-project.git
cd your-project
```

2. Set up the client (frontend):
```bash
cd client
npm install
```

3. Create a `.env` file in the client directory and add:
```bash
VITE_BACKEND_URL=http://localhost:5000 # or your frontend URL
```
4. Set up the server (backend):
```bash
cd ../server
npm install
```

5. Create a `.env` file in the server directory and add your environment variables:
```bash
DATABASE_URL=your_supabase_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173 # or your frontend URL
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

6. Generate tables and run database migrations:
```bash
npm run generate
npm run migrate
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```
2. In a new terminal, start the frontend development server:
```bash
cd client
npm run dev
```





