/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Users } from './Users.entity';
import { OrderDetails } from './OrderDetails.entity';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'orders' })
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();


    @Column({ type: 'date' })
    date: Date;

    @OneToOne(() => OrderDetails, orderDetails => orderDetails.order)
    orderDetails: OrderDetails;

    @ManyToOne(() => Users, user => user.orders)
    @JoinColumn({ name: 'userId' })
    user: Users;


}
