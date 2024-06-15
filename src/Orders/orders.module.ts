/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controllers";
import { OrderService } from "./orders.service";
import { OrdersRepository } from "./ordersRepository";
import { Orders } from "src/Entities/Orders.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetails } from "src/Entities/OrderDetails.entity";
import { products } from "src/Entities/Products.entity";
import { Users } from "src/Entities/Users.entity";
@Module({
    imports: [TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([OrderDetails]),
    TypeOrmModule.forFeature([Users,]),
    TypeOrmModule.forFeature([products]),
    ],
    controllers: [OrdersController],
    providers: [OrderService, OrdersRepository,],
})

export class OrdersModule { }
