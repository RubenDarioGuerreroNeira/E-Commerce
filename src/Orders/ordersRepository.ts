/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetails } from "src/Entities/OrderDetails.entity";
import { Repository } from "typeorm";
import { products } from "src/Entities/Products.entity"; // Cambiado de 'products' a 'Products'
import { Users } from "src/Entities/Users.entity";
import { Orders } from "src/Entities/Orders.entity";
//


@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(OrderDetails)
        private ordersDetailsRepository: Repository<OrderDetails>,

        @InjectRepository(Orders)
        private orderRepository: Repository<Orders>,

        @InjectRepository(products) // Cambiado de 'products' a 'Products'
        private productsRepository: Repository<products>,

        @InjectRepository(Users)
        private usersRepository: Repository<Users>
        

    ) { }

    async addOrders(user_id: string, products: any[]) {
        let total = 0;
        const user = await this.usersRepository.findOneBy({ id: user_id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = new Orders();
        order.date = new Date();
        order.user = user;

        const newOrder = await this.orderRepository.save(order);

        const productarray = await Promise.all(products.map(async (element) => {
            const product = await this.productsRepository.findOneBy({ id: element.id });

            if (!product) {
                throw new NotFoundException(`Product with ID ${element.id} not found`);
            }

            total += Number(product.price);

            await this.productsRepository.update({ id: element.id }, { stock: product.stock - 1 });

            return product;
        }));

        const orderDetail = new OrderDetails();
        orderDetail.price = Number(total.toFixed(2));
        orderDetail.products = productarray;
        orderDetail.order = newOrder;

        await this.ordersDetailsRepository.save(orderDetail);

        return await this.orderRepository.find({ where: { id: newOrder.id }, relations: { orderDetails: true } })

    }

    async getOrder(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['orderDetails']
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }



    async totalOrder(): Promise<{ totalOrders: number, totalAmount: number }> {

        const totalOrders = await this.orderRepository.count();
        const totalAmount = await this.ordersDetailsRepository.createQueryBuilder('od')
            .select('SUM(od.price)', 'totalAmount')
            .getRawOne();

        return {
            totalOrders,
            totalAmount: totalAmount.totalAmount
        };
    }

    // Numero Total de ordenes, total de precios de las ordenes por usuario
    async totalOrdersById(user_id: string): Promise<{ totalOrders: number, totalAmount: number }> {
        const user = await this.usersRepository.findOneBy({ id: user_id });
        if (!user) {
            throw new NotFoundException('User not found');
        } else {
            const totalOrders = await this.orderRepository.count({ where: { user: { id: user_id } } });
            const totalAmount = await this.ordersDetailsRepository.createQueryBuilder('od')
                .select('SUM(od.price)', 'totalAmount')
                .innerJoin('od.order', 'o')
                .where('o.userId = :userId')
                .setParameters({ userId: user_id })
                .getRawOne();
            return {
                totalOrders,
                totalAmount: totalAmount.totalAmount

            };
        }
    }





}


