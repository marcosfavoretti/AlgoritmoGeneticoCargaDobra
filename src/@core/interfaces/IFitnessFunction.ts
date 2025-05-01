import type { BendMachine, Pallets } from "../entities/__entities.export";


export interface IFitnessFunction {
    execute(population: Array<{ machine: BendMachine, pallet: Pallets }>): number;
}