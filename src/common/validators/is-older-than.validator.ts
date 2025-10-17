// src/common/validators/is-older-than.validator.ts
import { registerDecorator, ValidationOptions, ValidationArguments, } from 'class-validator';

export function IsOlderThan(age: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOlderThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date)) return false;
          const today = new Date();
          const birthDate = new Date(value);
          let userAge = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
          ) {
            userAge--;
          }
          return userAge >= age;
        },
        defaultMessage(args: ValidationArguments) {
          return `El usuario debe tener al menos ${age} años.`;
        },
      },
    });
  };
}
