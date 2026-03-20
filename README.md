# SyncForge

SyncForge is a collaborative workspace platform where users can create workspaces, upload files, and collaborate efficiently in a structured environment.

---

## Features

- 🔐 Authentication (JWT + cookies)
- 🏢 Workspace creation & management
- 📁 File uploads (AWS S3)
- 🔗 Temporary file URLs (signed URLs)
- 👥 User collaboration
- ⚡ Scalable backend architecture (Fastify + Prisma)

---

## 🧱 Tech Stack

### Frontend
- Next.js
- React
- Zustand (state management)
- React Query (data fetching)

### Backend
- Node.js
- Fastify

### Database
- PostgreSQL
- Prisma ORM

### Other
- AWS S3 (file storage)
- pnpm (package manager)

---

## 📁 Project Structure


syncforge/
│
├── frontend/ # Next.js app
├── backend/ # Fastify API server
├── docs/ # Project documentation


---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MuhammadHanzalaDev/syncforge.git
cd frontend/backend
2. Install dependencies
pnpm install
3. Setup environment variables

Create .env files in both frontend/ and backend/.

Backend .env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/syncforge
JWT_SECRET=your_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET=your_bucket
AWS_REGION=your_region
Frontend .env
NEXT_PUBLIC_API_URL=http://localhost:5000
4. Setup database
cd backend
pnpm prisma migrate dev
pnpm prisma generate
5. Run the app

run separately:

# frontend
cd frontend
pnpm dev

# backend
cd backend
pnpm dev
🔌 API Overview
Method	Endpoint	Description
POST	/auth/register	Register user
POST	/auth/login	Login user
GET	/workspaces	Get user workspaces
POST	/workspaces	Create workspace
POST	/files/upload	Upload file to S3
GET	/files/:id/url	Get temporary file URL
🏗️ Architecture Overview
Frontend communicates with backend via REST APIs
Backend (Fastify) handles routes, validation, and business logic
Prisma manages database interactions
PostgreSQL stores application data
AWS S3 stores files, accessed via signed URLs
📌 Future Improvements
Real-time collaboration (WebSockets)
Role-based access control (RBAC)
Notifications system
Activity logs
File versioning
🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Built with ❤️ by Muhammad Hanzala