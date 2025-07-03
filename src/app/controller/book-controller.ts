import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Book, Genre } from "../models/Book";
import { ApiResponse, ErrorResponse, QueryParams } from "../types/response";

export class BookController {
  // Create a new book
  static async createBook(req: Request, res: Response): Promise<void> {
    try {
      const bookData = req.body;

      // Validate genre
      if (!Object.values(Genre).includes(bookData.genre)) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Invalid genre provided",
          error: `Genre must be one of: ${Object.values(Genre).join(", ")}`,
        };
        res.status(400).json(errorResponse);
        return;
      }

      const book = new Book(bookData);
      await book.save();

      const response: ApiResponse = {
        success: true,
        message: "Book created successfully",
        data: book,
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error("Error creating book:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message:
          error.code === 11000
            ? "Book with this ISBN already exists"
            : "Validation failed",
        error: error,
      };

      res.status(400).json(errorResponse);
    }
  }

  // Get all books with filtering and sorting
  static async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const {
        filter,
        sortBy = "createdAt",
        sort = "desc",
        limit = 10,
      } = req.query as QueryParams;

      // Build filter object
      const filterObj: any = {};
      if (filter && Object.values(Genre).includes(filter as Genre)) {
        filterObj.genre = filter;
      }

      // Build sort object
      const sortObj: any = {};
      sortObj[sortBy] = sort === "asc" ? 1 : -1;

      const books = await Book.find(filterObj)
        .sort(sortObj)
        .limit(Number(limit));

      const response: ApiResponse = {
        success: true,
        message: "Books retrieved successfully",
        data: books,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching books:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to retrieve books",
        error: error,
      };

      res.status(500).json(errorResponse);
    }
  }

  // Get book by ID
  static async getBookById(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.params;

      if (!isValidObjectId(bookId)) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Invalid book ID",
          error: "Book ID must be a valid MongoDB ObjectId",
        };
        res.status(400).json(errorResponse);
        return;
      }

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

      const response: ApiResponse = {
        success: true,
        message: "Book retrieved successfully",
        data: book,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching book:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to retrieve book",
        error: error,
      };

      res.status(500).json(errorResponse);
    }
  }

  // Update book
  static async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.params;
      const updateData = req.body;

      if (!isValidObjectId(bookId)) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Invalid book ID",
          error: "Book ID must be a valid MongoDB ObjectId",
        };
        res.status(400).json(errorResponse);
        return;
      }

      const book = await Book.findByIdAndUpdate(bookId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Book not found",
          error: "No book found with the provided ID",
        };
        res.status(404).json(errorResponse);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Book updated successfully",
        data: book,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error updating book:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to update book",
        error: error,
      };

      res.status(400).json(errorResponse);
    }
  }

  // Delete book
  static async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.params;

      if (!isValidObjectId(bookId)) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Invalid book ID",
          error: "Book ID must be a valid MongoDB ObjectId",
        };
        res.status(400).json(errorResponse);
        return;
      }

      const book = await Book.findByIdAndDelete(bookId);

      if (!book) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Book not found",
          error: "No book found with the provided ID",
        };
        res.status(404).json(errorResponse);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Book deleted successfully",
        data: null,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error deleting book:", error);

      const errorResponse: ErrorResponse = {
        success: false,
        message: "Failed to delete book",
        error: error,
      };

      res.status(500).json(errorResponse);
    }
  }
}
