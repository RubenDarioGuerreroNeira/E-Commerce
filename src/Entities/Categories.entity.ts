/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { products } from './Products.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Categories {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ type: "varchar", unique: true, length: 50, nullable: false })
    name: string;

    @OneToMany(() => products, product => product.category_id)
    @JoinColumn()
    product: products[];
} 
