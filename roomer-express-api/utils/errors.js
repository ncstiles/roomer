class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
    }
  }
  
  class BadRequestError extends ExpressError {
    constructor(message) {
      super(message || "Bad request", 400);
    }
  }
  
  class NotFoundError extends ExpressError {
    constructor(message) {
      super(message || "Not found", 404);
    }
  }
  
  module.exports = {
    ExpressError: ExpressError,
    BadRequestError: BadRequestError,
    NotFoundError: NotFoundError,
  };
  