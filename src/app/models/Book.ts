import { model, Schema, type Document } from "mongoose";

// Define enum for genres
export enum Genre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  BIOGRAPHY = "BIOGRAPHY",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  FANTASY = "FANTASY",
}

// Define the Book interface
export interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Book schema

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      enum: {
        values: Object.values(Genre),
        message: "{VALUE} is not valid genre",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    description: { type: String },
    copies: {
      type: Number,
      required: [true, "At least one book copy needed"],
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Static method to check and update availability
bookSchema.statics.updateAvailability = async function (bookId: string) {
  const book = await this.findById(bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
  }
  return book;
};

// Instance method to borrow books
bookSchema.methods.borrowBooks = async function (quantity: number) {
  if (this.copies < quantity) {
    throw new Error("Not enough copies available");
  }

  this.quantity -= quantity;
  this.available = this.copies > 0;

  return await this.save();
};

// Pre-save middleware to update availability
bookSchema.pre("save", function (next) {
  this.available = this.copies > 0;
  next();
});

// Post-save middleware for logging
bookSchema.post("save", function (doc) {
  console.log(`Book "${doc.title}" has been saved with ${doc.copies} copies`);
});

// Create and export the Book model
export const Book = model<IBook>("Book", bookSchema);
