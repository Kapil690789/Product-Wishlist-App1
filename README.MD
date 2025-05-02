# FlockShop - Collaborative Product Wishlist App

A full‑stack MERN application that lets users create, manage, and interact with shared wishlists in real time. Users can sign up, create wishlists, add products, invite friends (mocked), and react or comment on items.

---


---

## Features

* **Authentication**: Signup/Login with JWT (mocked)
* **Wishlists**: Create, read, update, delete
* **Products**: Add, edit, remove items (name, image URL, price)
* **Collaboration**: Mock invites, real‑time updates via Socket.io
* **Interactions**: Emoji reactions & comments on products
* **Responsive UI**: Mobile‑friendly design

---

## Tech Stack

* **Frontend**: React, Vite, React Router, Socket.io Client
* **Backend**: Node.js, Express
* **Database**: MongoDB (Mongoose)
* **Real-Time**: Socket.io
* **Auth**: JWT (JSON Web Tokens)

---

## Project Structure

```
Product-Wishlist-App1/           # Root folder (GitHub: https://github.com/Kapil690789/Product-Wishlist-App1)
├── frontend/                    # React app
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
├── backend/                     # Express server
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── .env.example                 # Sample environment vars
├── package.json                 # Scripts & dependencies
└── README.md                    # This file
```

---

## Prerequisites

* Node.js v14+
* MongoDB Atlas account or local MongoDB

---

## Setup & Run

1. **Clone the repo**

   ```bash
   git clone https://github.com/Kapil690789/Product-Wishlist-App1.git
   cd Product-Wishlist-App1
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**

   * Copy `.env.example` to `.env` in the `backend/` folder
   * Fill in your values (see [Environment Variables](#environment-variables))

4. **Start servers**

   ```bash
   # In one terminal (backend)
   cd backend
   npm run start                # or node server.js

   # In another terminal (frontend)
   cd frontend
   npm run dev                  # Vite dev server
   ```

5. **Open in browser**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend API: [http://localhost:5001](http://localhost:5001) (or your configured PORT)

---

## Environment Variables

In `backend/.env`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

---

## Usage

1. **Sign up** as a new user
2. **Create** a wishlist
3. **Add** products (name, image URL, price)
4. **Invite** collaborators (mocked — share wishlist ID)
5. **Interact**: React with emojis or comment
6. **View** real‑time updates across browsers

---

## Assumptions & Limitations

* Invitation emails are mocked (no real email service)
* JWT without refresh tokens
* Socket.io uses in‑memory store (no Redis)
* Product images by URL only (no file uploads)

---

## Future Improvements

* File upload support for images
* Real email invitations & notifications
* Refresh token flow for JWT
* Redis or scaling for Socket.io
* Product filtering, sorting, price tracking
* User profiles, avatars, and social sharing

---

## Demo & Screenshots

*(Add screenshots or a Loom link here)*

---

## Deployment

1. **Build frontend**:

   ```bash
   cd frontend
   npm run build
   ```

2. **Configure production env vars** on your hosting platform

3. **Deploy backend** to Platform (Heroku, Render, DigitalOcean)

4. **Serve frontend** from static host (Netlify, Vercel) or via backend

---

*Happy coding!*
