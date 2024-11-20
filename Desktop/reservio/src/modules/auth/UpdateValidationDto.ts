import { IsBoolean } from 'class-validator';

export class UpdateValidationDto {
  @IsBoolean()
  Validation: boolean;
}
