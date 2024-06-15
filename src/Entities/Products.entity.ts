/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Categories } from './Categories.entity';
import { OrderDetails } from './OrderDetails.entity';
import { v4 as uuid } from 'uuid'
@Entity({ name: 'products' })
export class products {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ type: "varchar", unique: true, length: 50, nullable: false })
    name: string;

    @Column('text', { nullable: false })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column('int', { nullable: false })
    stock: number;

    @Column({ type: "text", default: 'default_image_url' })
    imgUrl: string;

    @ManyToOne(() => Categories, category => category.product)
    @JoinColumn({ name: 'category_id' })
    category_id: Categories;

    @ManyToMany(() => OrderDetails, OrderDetails => OrderDetails.products)
    // @JoinTable()
    orderDetails: OrderDetails[];
}
