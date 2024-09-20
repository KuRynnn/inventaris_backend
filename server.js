const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./app/middleware/errorHandler.middleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js app's URL
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./app/routes/auth.routes');
const itemRoutes = require('./app/routes/item.routes');
const movementRequestRoutes = require('./app/routes/movementRequest.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/movement-requests', movementRequestRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});