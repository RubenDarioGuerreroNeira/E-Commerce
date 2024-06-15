/* eslint-disable prettier/prettier */
import { Param, Controller, Get, Query } from '@nestjs/common';
import { ProdutsService } from './products.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { products } from 'src/Entities/Products.entity';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/Decorators/roles.decorators';
import { OnApplicationBootstrap } from '@nestjs/common'; // automatizo la precarga de datos 

@ApiTags('Products')
@Controller("products")
export class ProductsController implements OnApplicationBootstrap {
    constructor(private readonly productsService: ProdutsService,) { }

    // automatizo la carga de productos al inicial la bd 
    onApplicationBootstrap() {
        this.addProducts();
    }

    @Get('seeder')
    addProducts() {
        return this.productsService.addProducts()
    }



    @Get()
    // @ApiBearerAuth()
    // @Roles(Role.Admin)
    getProducts(@Query('page') page: number, @Query('limit') limit: number) {
        if (page && limit) {
            return this.productsService.getProducts(page, limit)
        }
        return this.productsService.getProducts(1, 2);
    }


    @ApiBearerAuth()
    @Roles(Role.Admin)
    @Get('/:id')
    async getProductById(@Param('id') id: string): Promise<products | null> {
        try {
            const product = await this.productsService.getProductById(id);
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);

            return null;
        }
    }

    // muestra el producto con mayor stock y el menor stock
    @Get('stock')
    async getStock() {
        return this.productsService.getStock()

    }

}

