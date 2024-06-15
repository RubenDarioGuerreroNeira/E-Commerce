/* eslint-disable prettier/prettier */
import { JoinColumn, Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinTable } from 'typeorm';
import { Orders } from './Orders.entity';
import { products } from './Products.entity';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'OrderDetails' })
export class OrderDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @OneToOne(() => Orders, order => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order: Orders;

    @ManyToMany(() => products)
    @JoinTable({ name: 'order_details_products' })
    products: products[];
}
