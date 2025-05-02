# FlockShop - Collaborative Product Wishlist App

FlockShop is a full-stack MERN application that allows users to create, manage, and interact with collaborative wishlists in real-time. Users can create wishlists, add products, invite friends, and interact with products through reactions and comments.

## Features

- User authentication (signup/login)
- Create, view, update, and delete wishlists
- Add, edit, and remove products from wishlists
- Invite other users to collaborate on wishlists
- Real-time updates using Socket.io
- Emoji reactions to products
- Comments on products
- Responsive, mobile-friendly UI

## Tech Stack

- **Frontend**: React (with Vite), React Router, Socket.io Client
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose)
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/flockshop-wishlist-app.git
   cd flockshop-wishlist-app
   \`\`\`

2. Install dependencies for both server and client:
   \`\`\`bash
   npm run install-all
   \`\`\`

3. Create a `.env` file in the root directory with the following variables:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. The application will be running at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

\`\`\`
flockshop-wishlist-app/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── vite.config.js      # Vite configuration
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── server.js           # Server entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── README.md               # Project documentation
\`\`\`

## Assumptions and Limitations

- The invitation system is mocked - in a production environment, this would send emails to invited users
- Authentication is implemented using JWT without refresh tokens
- The application uses a simple in-memory Socket.io implementation without Redis for scaling
- Image URLs are used instead of file uploads for simplicity

## Future Improvements

- Implement file uploads for product images
- Add email notifications for invitations and activity
- Implement refresh tokens for better security
- Add user profiles and avatars
- Add sorting and filtering options for products
- Implement a shopping list feature to track purchased items
- Add price tracking and comparison features
- Implement social sharing functionality
\`\`\`

Now let me provide you with a step-by-step guide to clone and run this project:

## How to Clone and Run the Project

1. **Clone the repository**

   Open your terminal/command prompt and run:
   \`\`\`bash
   git clone https://github.com/yourusername/flockshop-wishlist-app.git
   cd flockshop-wishlist-app
   \`\`\`

2. **Install dependencies**

   Install both server and client dependencies:
   \`\`\`bash
   npm run install-server
   npm run install-client
   \`\`\`
   
   Or use the combined command:
   \`\`\`bash
   npm run install-all
   \`\`\`

3. **Set up environment variables**

   Create a `.env` file in the root directory with your MongoDB connection string:
   \`\`\`
   MONGODB_URI=mongodb+srv://kapilsharma:Kapil@cluster0.kapfc.mongodb.net
   JWT_SECRET=flockshop-secret-key-2025
   PORT=5000
   \`\`\`

4. **Start the development server**

   Run both the backend and frontend in development mode:
   \`\`\`bash
   npm run dev
   \`\`\`

   This will start:
   - Backend server at http://localhost:5000
   - Frontend development server at http://localhost:3000

5. **Access the application**

   Open your browser and navigate to:
   \`\`\`
   http://localhost:3000
   \`\`\`

6. **Create an account and start using the app**

   - Register a new account
   - Create a wishlist
   - Add products to your wishlist
   - Invite friends (use another browser or incognito window to test)
   - React to products and add comments

## Deployment Instructions

To deploy this application to a production environment:

1. **Build the frontend**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set up environment variables on your hosting platform**
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production

3. **Deploy the application**
   - Deploy the backend to a Node.js hosting service (Heroku, Render, DigitalOcean, etc.)
   - Deploy the frontend build folder to a static hosting service (Netlify, Vercel, etc.) or serve it from your backend

The application is now ready to be used and deployed!
