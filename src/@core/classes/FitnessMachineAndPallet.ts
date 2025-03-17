import { Machine } from "../abstractions/Machine";
import type { IFitnessFunction } from "../interfaces/IFitnessFunction";
import type { BendMachine } from "./BendMachine";
import type { Pallets } from "./Pallet";

export class FitnessMachineAndPallet implements IFitnessFunction {
    
    execute(population: Array<{ machine: BendMachine; pallet: Pallets; }>): number {
        const parallelMachines = new Map<Machine, number>();
        population.forEach((unit) => {
            const productionTime = this.calculateLeadTime(unit.machine, unit.pallet);
            parallelMachines.set(
                unit.machine,
                (parallelMachines.get(unit.machine) || 0) + productionTime
            )
        });
        return Math.max(...parallelMachines.values()) ;
    }

    private calculateLeadTime(machine: BendMachine, pallet: Pallets): number {
        const itens = pallet.getItensWithPreference(machine.getSetup()?.getSetUpId());
        return itens.reduce((total, item) => {
            const setUpCost = machine.checkSetUp(item);
            return total + machine.productionTime(item)! + setUpCost
        }, 0);
    }
}