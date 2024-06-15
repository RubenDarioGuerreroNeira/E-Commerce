/* eslint-disable prettier/prettier */
import { JoinColumn, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Orders } from './Orders.entity';
import { v4 as uuid } from 'uuid'
@Entity({ name: 'users' })
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ type: 'varchar', length: 20, nullable: false })
    password: string;

    @Column('int', { nullable: true })
    phone: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    country: string;

    @Column('text', { nullable: true })
    address: string;

    @Column({ length: 50, nullable: true })
    city: string;

    @OneToMany(() => Orders, order => order.user)
    @JoinColumn({ name: 'orders_id' })
    orders: Orders[];
}
