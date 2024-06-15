/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controllers";
import { ProdutsService } from "./products.service";
import { ProductsRepository } from "./productsRepository";
import { Categories } from 'src/Entities/Categories.entity';
import { products } from "src/Entities/Products.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesRepository } from "src/categories/categories.repository";
@Module({
    imports: [TypeOrmModule.forFeature([products]),
    TypeOrmModule.forFeature([Categories])],
    controllers: [ProductsController],
    providers: [ProdutsService, ProductsRepository, CategoriesRepository],
})

export class ProductsModule { }
