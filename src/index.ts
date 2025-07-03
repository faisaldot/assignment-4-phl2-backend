import "dotenv/config";
import express, { type Express } from "express";

import connectDb from "src/app/config/database";
import { errorHandler, notFound } from "src/app/middleware/error-handler";

const PORT = process.env.PORT;
const app: Express = express();

app.use(express.json());

// Connecting to Database
connectDb();

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Listening on Server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});

export default app;
