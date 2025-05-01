import { Collection, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Item } from "./Item.entity";
import { Tools } from "./Tools.entity";

@Entity('Setup')
export class Setup {
    @PrimaryGeneratedColumn('increment')
    setupId!: number;

    @OneToOne(() => Tools, tool => tool.toolsId, { cascade: true })
    @JoinColumn({ name: 'toolName' })
    toolName!: Tools

    @Column('int')
    costTime!: number;

    @Column('int')
    removaltime!: number;

    getSetupRemovalTime(): number {
        return this.removaltime;
    }

    getSetUpId(): number {
        return this.setupId;
    }

    getTool(): Tools {
        return this.toolName;
    }

    getSetupCost(): number {
        return this.costTime;
    }
}