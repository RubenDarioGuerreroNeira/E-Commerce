/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common"
import { OrdersRepository } from "./ordersRepository";

@Injectable()

export class OrderService {
    constructor(private orderservice: OrdersRepository) { }

    addOrders(user_id: string, products: any) {
        return this.orderservice.addOrders(user_id, products)
    }


    getOrder(id: string) {
        return this.orderservice.getOrder(id)
    }

    // deleteOrder(id: string) {
    //     return this.orderservice.deleteOrder(id)
    // }

    async getTotalOrders(): Promise</*number*/{ totalOrders: number, totalAmount: number }> {
        return this.orderservice.totalOrder();
    }

    // Numero Total de ordenes, total de precios de las ordenes por usuario
    async getTotalOrderById(id: string): Promise<{ totalOrders: number, totalAmount: number }> {
        return this.orderservice.totalOrdersById(id);
    }


}
