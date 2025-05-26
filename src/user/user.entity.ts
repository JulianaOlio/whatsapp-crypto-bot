import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ unique: true, nullable: true })
    whatsappNumber: string;

    @Column()
    name: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}