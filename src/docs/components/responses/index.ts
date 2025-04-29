import { BadRequest } from './BadRequest';
import { NotFound } from './NotFound';
import { Unauthorized } from './Unauthorized';
import { InternalServerError } from './InternalServerError';
import { SuccessResponse } from './SuccessResponse';
import { PaginatedSuccessResponse } from './PaginatedSuccessResponse';

export const responses = {
  BadRequest,
  NotFound,
  Unauthorized,
  InternalServerError,
  SuccessResponse,
  PaginatedSuccessResponse
};
