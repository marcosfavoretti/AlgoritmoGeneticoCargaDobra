import { ChildEntity, Column } from "typeorm";
import { Machine } from "./Machine.entity";
import type { Setup } from "./Setup.entity";
import { OPERATIONS } from "../enums/OPERATIONS.enum";
import type { Item } from "./Item.entity";

@ChildEntity('BendMachine')
export class BendMachine extends Machine {
    private setup?: Setup;

    @Column('int', { nullable: true })
    setUpBoost?: number;

    @Column('int', { nullable: true })
    bendBoost?: number;

    constructor(name: string) {
        super(name, 'BendMachine', OPERATIONS.DOBRA);
    }

    productionTime(item: Item): number | null {
        return (item.getTimeByOp(this.getOperationTag()) ?? 0) * (1.0 - (this.bendBoost ?? 0));
    }

    /**
    * 
    *@description esse metodo ira voltar o valor 0 caso não for preciso de setup
    */
    checkSetUp(item: Item): number {
        if (this.setup?.getTool().getToolName() === item.getSetUpDepedency().getTool().getToolName()) {
            return 0
        }
        const removalCost = this.setup?.getSetupRemovalTime() ?? 0;
        this.setSetup(item.getSetUpDepedency());
        const setupCost = item.getSetUpDepedency().getSetupCost() * (1.0 - (this.setUpBoost ?? 0));
        return setupCost + removalCost;
    }

    getSetup(): Setup | undefined {
        return this.setup;
    }

    private setSetup(setup: Setup): void {
        this.setup = setup;
    }
}