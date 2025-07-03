import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Borrow } from "../models/Borrow";
import { Book } from "../models/Book";
import { ApiResponse, ErrorResponse } from "../types/response";

export class BorrowController {
  // Borrow a book
  static async borrowBook(req: Request, res: Response): Promise<void> {
    try {
      const { book: bookId, quantity, dueDate } = req.body;

      // Validate ObjectId
      if (!isValidObjectId(bookId)) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Invalid book ID",
          error: "Book ID must be a valid MongoDB ObjectId",
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Find the book
      const book = await Book.findById(bookId);
      if (!book) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Book not found",
          error: "No book found with the provided ID",
        };
        res.status(404).json(errorResponse);
        return;
      }

      // Check if enough copies are available
      if (book.copies < quantity) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Not enough copies available",
          error: `Only ${book.copies} copies available, but ${quantity} requested`,
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Use the instance method to borrow books
      await book.borrowBooks(quantity);

      // Create borrow record
      const borrowRecord = Borrow.create({
        book: bookId,
        quantity,
        dueDate: new Date(dueDate),
      });

      const response: ApiResponse = {
        success: true,
        message: "Book borrowed successfully",
        data: borrowRecord,
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error("Error borrowing book:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to borrow book",
        error: error.message || error,
      };

      res.status(400).json(errorResponse);
    }
  }

  // Get borrowed books summary using aggregation
  static async getBorrowedBooksSummary(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const borrowedBooksSummary = await Borrow.aggregate([
        {
          $group: {
            _id: "$book",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $project: {
            _id: 0,
            book: {
              title: "$bookDetails.title",
              isbn: "$bookDetails.isbn",
            },
            totalQuantity: 1,
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
      ]);

      const response: ApiResponse = {
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: borrowedBooksSummary,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching borrowed books summary:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to retrieve borrowed books summary",
        error: error,
      };

      res.status(500).json(errorResponse);
    }
  }
}
