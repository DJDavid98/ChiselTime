import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

/**
 * @see https://docs.nestjs.com/pipes#object-schema-validation
 */
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {
      convert: true,
      stripUnknown: true,
    });
    if (error) {
      throw new BadRequestException(
        `Validation failed:\n${error.annotate(true)}`,
      );
    }
    return value;
  }
}
