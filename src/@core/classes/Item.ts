import type { OPERATIONS } from "../enums/OPERATIONS.enum"
import type { BendSetup } from "./Setup";

export type operationProps = {
    operationMap: Map<OPERATIONS, number>;
}
export class Item {
    constructor(private partcode: string, private operation: operationProps, private setUpDepedency: BendSetup) { }
    getSetUpDepedency(): BendSetup {
        return this.setUpDepedency;
    }

    getTimeByOp(operation: OPERATIONS): number | null {
        return this.operation.operationMap.get(operation) ?? null;
    }
}