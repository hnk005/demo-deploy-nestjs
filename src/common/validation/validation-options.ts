import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { generateErrors } from '../utils.js';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    }),
};

export default validationOptions;
