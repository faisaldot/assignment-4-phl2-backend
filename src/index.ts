import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";

import connectDb from "./app/config/database";
import { errorHandler, notFound } from "./app/middleware/error-handler";
import bookRouter from "./app/routes/book-route";
import borrowRouter from "./app/routes/borrow-routes";

const PORT = process.env.PORT;
const app: Express = express();

// Connecting to Database
connectDb();

//Middleware
app.use(
  cors({
    origin: ["https://assignment-4-phl2.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library Management API is running.",
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Listening on Server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});

export default app;
