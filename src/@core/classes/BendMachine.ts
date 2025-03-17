import { Machine } from "../abstractions/Machine";
import { OPERATIONS } from "../enums/OPERATIONS.enum";
import type { Item } from "./Item";
import type { BendSetup } from "./Setup";

export class BendMachine extends Machine {
    private setup?: BendSetup;

    constructor(model: string, private setUpBoost?: number, private bendBoost?: number) {
        super(model, OPERATIONS.DOBRA)
    }

    setSetUpBoost(boost: number): void {
        if (boost > 1) throw new Error('boost não pode ser maior que 1')
        this.setUpBoost = boost
    }

    setBendBoost(boost: number): void {
        if (boost > 1) throw new Error('boost não pode ser maior que 1')
        this.bendBoost = boost;
    }

    productionTime(item: Item): number | null {
        return (item.getTimeByOp(this.getOperationTag()) ?? 0) * (1.0 - (this.bendBoost ?? 0));
    }
    
    /**
     * 
     *@description esse metodo ira voltar o valor 0 caso não for preciso de setup
     */
    checkSetUp(item: Item): number {
        if (this.setup?.getSetUpId() === item.getSetUpDepedency().getSetUpId()) {
            return 0
        }
        this.setSetup(item.getSetUpDepedency());
        return item.getSetUpDepedency().getSetupCost() * (1.0 - (this.setUpBoost ?? 0));
    }

    getSetup(): BendSetup | undefined {
        return this.setup;
    }

    private setSetup(setup: BendSetup): void {
        this.setup = setup;
    }

    toString(): string {
        return `BendMachine(model: ${this.getModel}, setup: ${this.setup ? this.setup.getSetUpId() : 'none'})`;
    }
}