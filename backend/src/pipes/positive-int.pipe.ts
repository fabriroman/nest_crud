import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);

    if (isNaN(val)) {
      throw new BadRequestException('Validation failed (integer expected)');
    }

    if (val <= 0) {
      throw new BadRequestException(
        'Validation failed (positive integer is expected)',
      );
    }

    return val;
  }
}
