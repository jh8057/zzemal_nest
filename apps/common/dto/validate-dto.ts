import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  payload: any,
): Promise<{ valid: true; data: T } | { valid: false; errors: any[] }> {
  const instance = plainToInstance(dtoClass, payload);
  const errors = await validate(instance);

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      })),
    };
  }

  return { valid: true, data: instance };
}
