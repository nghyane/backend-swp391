export class NotFoundError extends Error {
  constructor(
    readonly entity: string,
    readonly id?: number | string,
    message?: string
  ) {
    super(message || `${entity} not found${id ? ` with id ${id}` : ''}`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(
    readonly field: string,
    message?: string
  ) {
    super(message || `Invalid ${field}`);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message?: string) {
    super(message || 'Unauthorized access');
    this.name = 'AuthorizationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message || 'Authentication failed');
    this.name = 'AuthenticationError';
  }
}

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isAuthorizationError = (error: unknown): error is AuthorizationError => {
  return error instanceof AuthorizationError;
};

export const isAuthenticationError = (error: unknown): error is AuthenticationError => {
  return error instanceof AuthenticationError;
};

export class ConflictError extends Error {
  constructor(message?: string) {
    super(message || 'Resource conflict');
    this.name = 'ConflictError';
  }
}

export const isConflictError = (error: unknown): error is ConflictError => {
  return error instanceof ConflictError;
};
