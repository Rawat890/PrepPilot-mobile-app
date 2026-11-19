import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/db.js';
import { initRedis } from './config/redis.js';
import swaggerSpec from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Connect Database & Optional Redis
connectDB();
initRedis();

// Core Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/', (req, res) => {
  res.json({
    app: 'PrepPilot Mobile API',
    status: 'Running',
    docs: '/api-docs',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/store', storeRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger API Docs available at http://localhost:${PORT}/api-docs`);
});
