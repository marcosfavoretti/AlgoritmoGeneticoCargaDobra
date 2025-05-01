import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { OPERATIONS } from "../enums/OPERATIONS.enum";
import { Item } from "./Item.entity.ts";

@Entity({ name: 'Operation' })
export class Operation  {
    @PrimaryGeneratedColumn('increment')
    operationId!: number;

    @Column('int')
    time!: number;

    @Column({ 
        type: 'text', 
        enum: OPERATIONS 
    })
    operation!: OPERATIONS;

    @ManyToOne(() => Item, (item) => item.operation)
    @JoinColumn({ name: 'item' })
    item!: Relation<Item>;
}