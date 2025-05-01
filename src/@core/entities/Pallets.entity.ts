import { Entity, ObjectIdColumn, ObjectId, Column, PrimaryGeneratedColumn, OneToMany, type Relation } from 'typeorm';
import { Item } from './Item.entity';
import { ManagerPallets } from './ManagerPallets.entity';

@Entity({
    name: 'Pallets',
})
export class Pallets {
    @PrimaryGeneratedColumn('increment')
    palletsId!: number;

    @Column('varchar')
    finalProduct!: string;

    @OneToMany(() => ManagerPallets, m => m.palletId, { nullable: false })
    managerPallets!: Relation<ManagerPallets[]>;

    private setupOptmize!: { [key: number]: Item[] };


    getId(): number {
        return this.palletsId;
    }

    /**
    * @description devolvo uma lista de item agrupada por setup,
    *  sendo que o primeiro sempre sera o setup passado como preferencia
    */
    getItensWithPreference(setupId?: number): Item[] {
        this.groupPalletBySetup();
        const priority = setupId && this.setupOptmize[setupId] ? this.setupOptmize[setupId] : [];
        const otherItems = Object.entries(this.setupOptmize)
            .filter(([key]) => Number(key) !== setupId)
            .flatMap(([, items]) => items);
        return [...priority, ...otherItems];
    }

    /**
    * @description agrupo os itens por setupId dentro de um dicionario
    */
    private groupPalletBySetup(): void {
        this.setupOptmize = {}
        for (const item of this.managerPallets.map(m=>m.item!)) {
            const setup = item.getSetUpDepedency().getSetUpId();
            if (Object.prototype.hasOwnProperty.call(this.setupOptmize, setup)) {
                this.setupOptmize[setup].push(item);
            }
            else {
                this.setupOptmize[setup] = [item];
            }
        }
    }



}