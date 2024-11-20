import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteDto } from './CreateFavoriteDto';

export class UpdateFavoriteDto extends PartialType(CreateFavoriteDto) {}
