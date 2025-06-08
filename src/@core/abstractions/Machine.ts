import type { Item } from "../entities";
import type { OPERATIONS } from "../enums/OPERATIONS.enum";

export abstract class Machine {
    constructor(private model: string, private operationTag: OPERATIONS) { }

    productionTime(item: Item): number | null {
        return item.getTimeByOp(this.operationTag);
    }

    getOperationTag(): OPERATIONS {
        return this.operationTag;
    }

    getModel(): string {
        return this.model;
    }
}