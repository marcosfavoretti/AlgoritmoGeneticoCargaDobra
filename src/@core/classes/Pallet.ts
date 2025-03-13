import type { Item } from "./Item";

export class Pallets {
    constructor(
        private id: number,
        private itens: Item[]
    ) { }

    getId(): number {
        return this.id;
    }
    getItens(): Item[] {
        return this.itens;
    }
}