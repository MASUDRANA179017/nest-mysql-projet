import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ description: 'Withdrawal amount', example: 50.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Description', example: 'Withdraw to bank', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

