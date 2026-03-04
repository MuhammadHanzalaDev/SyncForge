import { ZodError } from "zod";

// Define a base ApiError class
class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500, name = "ApiError") {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}

// Extend for specific HTTP errors
class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NotFoundError");
  }
}

class BadRequestError extends ApiError {
  constructor(message: string = "Bad request") {
    super(message, 400, "BadRequestError");
  }
}

function formatZodError(err: ZodError) {
  return err.issues.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
}

export { ApiError, NotFoundError, BadRequestError, formatZodError };
