import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

import { ValidationErrorsTree } from '@/constants/validate-errors.type.js';

/**
 * validate configuration object against a class-validator class
 * @template T
 * @param {Record<string, unknown>} config
 * @param {ClassConstructor<T>} envClass
 * @returns {T}
 * @throws {Error} if validation fails
 */
export function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envClass: ClassConstructor<T>,
): T {
  const validated = plainToInstance(envClass, config, {
    exposeDefaultValues: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const message = errors
      .map(
        (e) =>
          `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(`Invalid environment variables:\n${message}`);
  }

  return validated;
}

/**
 * generate a validation errors tree from an array of validation errors
 * @param {ValidationError[]} errors
 * @returns {ValidationErrorsTree}
 */
export function generateErrors(
  errors: ValidationError[],
): ValidationErrorsTree {
  return errors.reduce<ValidationErrorsTree>(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}
