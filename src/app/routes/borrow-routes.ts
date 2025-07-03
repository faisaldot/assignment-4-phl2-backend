import { Router } from "express";
import { BorrowController } from "../controller/borrow-controller";

const borrowRouter = Router();

// POST /api/borrow - Borrow a book
borrowRouter.post("/", BorrowController.borrowBook);

// GET /api/borrow - Get borrowed books summary
borrowRouter.get("/", BorrowController.getBorrowedBooksSummary);

export default borrowRouter;
