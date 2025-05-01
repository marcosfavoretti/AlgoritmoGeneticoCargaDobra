import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Tools')
export class Tools{
    @PrimaryGeneratedColumn('increment')
    toolsId!: number;

    @Column('varchar')
    toolsName!: string;

    getToolName():string{
        return this.toolsName;
    }
}