import type { Item } from "./Item";

export class Pallets {
    private setupOptmize!: { [key: number]: Item[] };
    constructor(
        private id: number,
        private itens: Item[]
    ) {
        this.groupPalletBySetup();
    }

    getId(): number {
        return this.id;
    }

    /**
     * 
     * @description devolvo uma lista de item agrupada por setup,
     *  sendo que o primeiro sempre sera o setup passado como preferencia
     */
    getItensWithPreference(setupId?: number): Item[] {
        const priority = setupId && this.setupOptmize[setupId] ? this.setupOptmize[setupId] : [];
        const otherItems = Object.entries(this.setupOptmize)
            .filter(([key]) => Number(key) !== setupId)
            .flatMap(([, items]) => items);
        return [...priority, ...otherItems];
    }

    getItens(): Item[] {
        return this.itens;
    }

    /**
     * @description agrupo os itens por setupId dentro de um dicionario
     */
    private groupPalletBySetup(): void {
        this.setupOptmize = {}
        for (const item of this.itens) {
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