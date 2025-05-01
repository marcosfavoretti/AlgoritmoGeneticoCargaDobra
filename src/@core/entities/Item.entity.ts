import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Setup } from "./Setup.entity";
import type { OPERATIONS } from "../enums/OPERATIONS.enum";
import { Pallets } from "./Pallets.entity";
import { Operation } from "./Operations.entity.ts";
import { ManagerPallets } from "./ManagerPallets.entity.ts";

@Entity({name:'Item'})
export class Item {
    @PrimaryColumn()
    partcode!: string;

    @OneToOne(() => Setup, (setup) => setup.setupId, { nullable: false, cascade: true})
    @JoinColumn({name: 'setup'})
    setup!: Relation<Setup>;

    @OneToMany(() => Operation, (operation) => operation.item, {cascade: true})
    operation!: Relation<Operation[]>;

    getSetUpDepedency(): Setup {
        return this.setup;
    }

    getTimeByOp(operation: OPERATIONS): number | null {
        return this.operation.find(op=> op.operation === operation)?.time ?? null;
    }
}

