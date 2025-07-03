import type { Request, Response, NextFunction } from "express";
import type { ErrorResponse } from "../types/response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const errorResponse: ErrorResponse = {
    success: false,
    message: err.message || "Internal server error.",
    error: err,
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    errorResponse.message = "Validation failed.";
    res.status(400).json(errorResponse);
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 11000) {
    errorResponse.message = "Duplicate field value entered.";
    res.status(400).json(errorResponse);
    return;
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    (errorResponse.message = "Invalid ID format"),
      res.status(400).json(errorResponse);
    return;
  }

  // Default error
  res.status(500).json(errorResponse);
};

export const notFound = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found.`,
    error: `Not Found`,
  };

  res.status(400).json(errorResponse);
};
