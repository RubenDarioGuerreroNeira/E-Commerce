/* eslint-disable prettier/prettier */
import { IsUUID, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { products } from 'src/Entities/Products.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrdersDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Write Id by User",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    products: Partial<products[]>;
}
