import { BookController } from "../controller/book-controller";
import { Router } from "express";

const bookRouter = Router();

bookRouter.post("/", BookController.createBook);

bookRouter.get("/", BookController.getAllBooks);

bookRouter.get("/:bookId", BookController.getBookById);

bookRouter.put("/:bookId", BookController.updateBook);

bookRouter.delete("/:bookId", BookController.deleteBook);

export default bookRouter;
