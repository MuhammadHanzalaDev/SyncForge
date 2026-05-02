import { ZodError } from "zod";
import { Server } from "socket.io";

// Define a base ApiError class
class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode = 500, name = "ApiError", data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.data = data;
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

function socketHandler(handler: any) {
  return async (socket: Server, data: any) => {
    try {
      await handler(socket, data);
    } catch (err: any) {
      console.error(err);
      socket?.emit?.("error", { message: err.message || "Something went wrong" });
    }
  };
}

export {
  ApiError,
  NotFoundError,
  BadRequestError,
  formatZodError,
  socketHandler,
};
