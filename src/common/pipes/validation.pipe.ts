import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

function formatErrors(errors: ValidationError[]) {
  return errors.flatMap((err) =>
    Object.values(err.constraints || {}).map((msg) => ({
      field: err.property,
      message: msg,
    }))
  );
}

export const CustomValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidUnknownValues: false,
  exceptionFactory: (errors: ValidationError[]) => {
    return new BadRequestException({
      message: 'Validación fallida',
      errors: formatErrors(errors),
    });
  },
});

//add to main.ts to use.