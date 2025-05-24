import type { BendMachine, Pallets, Machine } from "../entities/index.ts";
import type { IFitnessFunction } from "../interfaces/IFitnessFunction";


export class FitnessMachineAndPallet implements IFitnessFunction {

    execute(population: Array<{ machine: BendMachine; pallet: Pallets; }>): number {
        const parallelMachines = new Map<Machine, number>();
        population.forEach((unit) => {
            const time = this.calculateLeadTime(unit.machine, unit.pallet);
            this.updateMap(parallelMachines, unit.machine, time);
        });
        return Math.max(...parallelMachines.values());
    }

    private updateMap(map: Map<Machine, number>, machine: Machine, time: number): void {
        map.set(
            machine,
            (map.get(machine) || 0) + time
        )
    }

    private calculateLeadTime(machine: BendMachine, pallet: Pallets): number {
        const itens = pallet.getItensWithPreference(machine.getSetup()?.getSetUpId());
        return itens.reduce((total, item) => {
            const setUpCost = machine.checkSetUp(item);
            return total + (machine.productionTime(item)!*pallet.currentLote) + setUpCost
        }, 0);
    }
}