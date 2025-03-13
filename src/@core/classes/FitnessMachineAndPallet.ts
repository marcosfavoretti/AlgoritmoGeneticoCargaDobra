import { Machine } from "../abstractions/Machine";
import type { IFitnessFunction } from "../interfaces/IFitnessFunction";
import type { BendMachine } from "./BendMachine";
import type { Item } from "./Item";
import type { Pallets } from "./Pallet";

export class FitnessMachineAndPallet implements IFitnessFunction {
    execute(population: Array<{ machine: BendMachine; pallet: Pallets; }>): number {
        const parallelMachines = new Map<Machine, number>();
        population.forEach((unit) => {
            const currentMachine = unit.machine;
            const productionTime = this.productionTime(unit.machine, unit.pallet.getItens());
            parallelMachines.set(
                currentMachine,
                (parallelMachines.get(currentMachine) || 0) + productionTime
            )
        });
        return Math.max(...parallelMachines.values()) ;
    }
    
    private productionTime(machine: BendMachine, itens: Item[]): number {
        return itens.reduce((total, item) => {
            const setUpCost = machine.checkSetUp(item);//volta zero caso nao precise de setup;
            return total + machine.productionTime(item)! + setUpCost
        }, 0);
    }
}