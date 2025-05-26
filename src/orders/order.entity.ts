import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number; 

    @Column()
    type: 'buy' | 'sell';

    @Column()
    asset: string; 

    @Column('decimal', { precision: 18, scale: 8 })
    amount: number;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    totalAmount: number; 

    @Column({ default: 'pending' })
    status: string;

    @Column()
    source: string; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'float', nullable: true })
    priceAtExecution?: number;

    @Column({ type: 'float', nullable: true })
    totalInBRL?: number;
}
