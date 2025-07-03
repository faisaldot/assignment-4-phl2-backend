import { Schema, model, Document, Types } from "mongoose";
import { IBook } from "./Book";

// Define the Borrow interface
export interface IBorrow extends Document {
  book: Types.ObjectId | IBook;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Borrow schema
const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware
borrowSchema.pre("save", function (next) {
  if (this.dueDate <= new Date()) {
    throw new Error("Due date must be in the future");
  }
  next();
});

// Post-save middleware for logging
borrowSchema.post("save", function (doc) {
  console.log(
    `Borrow record created for book: ${doc.book} with quantity: ${doc.quantity}`
  );
});

// Create and export the Borrow model
export const Borrow = model<IBorrow>("Borrow", borrowSchema);
