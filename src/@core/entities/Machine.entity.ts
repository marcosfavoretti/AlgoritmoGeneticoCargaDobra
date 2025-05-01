import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import type { OPERATIONS } from "../enums/OPERATIONS.enum";
import type { Item } from "./Item.entity";

@Entity('Machine')
@TableInheritance({ column: 'type' })
export abstract class Machine {
    @PrimaryGeneratedColumn('increment')
    machineId!: number;

    @Column('varchar')
    type: string;

    @Column('varchar')
    model: string;

    @Column('varchar')
    operation: OPERATIONS;

    constructor(model: string, type: string, operations: OPERATIONS) {
        this.type = type;
        this.model = model;
        this.operation = operations;
    }

    productionTime(item: Item): number | null {
        return item.getTimeByOp(this.operation);
    }

    getOperationTag(): OPERATIONS {
        return this.operation;
    }

    getModel(): string {
        return this.model;
    }
}