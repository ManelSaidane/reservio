import { IsNotEmpty, IsInt, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  montant: number;

  // @IsNotEmpty()
  // @IsInt()
  // IDServ: number;

  @IsNotEmpty()
  @IsString()
  NumCarte: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
