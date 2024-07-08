/* eslint-disable prettier/prettier */
import { IsUUID, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { products } from 'src/Entities/Products.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrdersDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Write Id by User",
        example: "206644f0-4e8a-4cd5-9464-ed9b57e5adbb"
    })
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    products: Partial<products[]>;
}
