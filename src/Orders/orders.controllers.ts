/* eslint-disable prettier/prettier */
import { Param, Put, Body, Post, Query, Controller, Get, ParseUUIDPipe, UseGuards, Delete, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/Decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags,ApiOperation } from '@nestjs/swagger';
import { OrdersDto } from './orders.Dto';


import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private OrderService: OrderService,) { }
    
    @ApiTags('Orders')
    // Total de Ordenes 
    @Get('total')
    @ApiOperation({ summary: ' Get Total Orders' })
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles(Role.Admin) // Admin
    
    async getTotalOrders(): Promise<{ totalOrders: number, totalAmount: number }/*{ totalOrders: number }*/> {
        // const totalOrders = await this.OrderService.getTotalOrders();
        // return { totalOrders };
        const { totalOrders, totalAmount } = await this.OrderService.getTotalOrders();
        return { totalOrders, totalAmount };
    }

    
    @Post()
    @ApiOperation({ summary: ' Create Order' })
    // addOrders(@Body() order: any) {
    addOrders(@Body() order: OrdersDto) {
        // const { user_id, products } = order cambie 2 lineas 
         const { userId, products } = order
        // return this.OrderService.addOrders(user_id, products);
        return this.OrderService.addOrders(userId, products);
    }
    
    // @ApiBearerAuth()
    // @Roles(Role.Admin) //  Admin
    // @UseGuards(AuthGuard, RolesGuard)
    @Get(':id')
    @ApiOperation({ summary: ' Get Order By Id' })
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



    @Get('user/:id')
    @ApiOperation({ summary: ' Get Order By Id User' })
    // @ApiBearerAuth()
    // @Roles(Role.User, Role.Admin) // User
    // @UseGuards(AuthGuard, RolesGuard)
    async getOrdersByUser(@Param('id') id: string) {
        return this.OrderService.getTotalOrderById(id);

    }


}