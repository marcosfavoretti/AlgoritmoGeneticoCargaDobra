import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Pallets } from "./Pallets.entity";
import { Item } from "./Item.entity";

@Entity('ManagerPallets')
export class ManagerPallets {
    @PrimaryGeneratedColumn('increment')
    managerPalletsId!: number;

    @ManyToOne(() => Pallets, (pallet) => pallet.managerPallets)
    @JoinColumn({ name: 'palletId' })
    palletId!: Relation<Pallets>;

    @Column('int')
    qtd!: number;

    @OneToOne(() => Item, (m) => m.partcode, { nullable: true })
    @JoinColumn({ name: 'item' })
    item?: Relation<Item>;
}   