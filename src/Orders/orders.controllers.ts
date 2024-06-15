/* eslint-disable prettier/prettier */
import { Param, Put, Body, Post, Query, Controller, Get, ParseUUIDPipe, UseGuards, Delete, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/Decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersDto } from './orders.Dto';


import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private OrderService: OrderService,) { }

    // Total de Ordenes 
    @Get('total')
    @ApiBearerAuth()
    @Roles(Role.Admin) // Admin
    @UseGuards(AuthGuard, RolesGuard)
    async getTotalOrders(): Promise<{ totalOrders: number, totalAmount: number }/*{ totalOrders: number }*/> {
        // const totalOrders = await this.OrderService.getTotalOrders();
        // return { totalOrders };
        const { totalOrders, totalAmount } = await this.OrderService.getTotalOrders();
        return { totalOrders, totalAmount };
    }

    @Post()
    // @UseGuards(AuthGuard)
    addOrders(@Body() order: any) {
        const { user_id, products } = order
        return this.OrderService.addOrders(user_id, products);
    }

    @Get(':id')
    @ApiBearerAuth()
    @Roles(Role.Admin) //  Admin
    @UseGuards(AuthGuard, RolesGuard)
    getOderById(@Query('id', ParseUUIDPipe) id: string) {
        // return this.OrderService.getOrder(id)

        try {
            return this.OrderService.getOrder(id);
        } catch (error) {
            if (error.message === 'jwt expired') {
                throw new UnauthorizedException('Token has Expired');
            } else {
                throw error;
            }
        }
    }


    @ApiBearerAuth()
    @Delete(':id')
    @Roles(Role.SAdmin) // Super Admin
    @UseGuards(AuthGuard, RolesGuard)
    DeleteOrder(@Param("id") id: string) {
        return this.OrderService.deleteOrder(id);

    }

    @Get('user/:id')
    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin) // User
    @UseGuards(AuthGuard, RolesGuard)
    async getOrdersByUser(@Param('id') id: string) {
        return this.OrderService.getTotalOrderById(id);

    }




}