import type { BendMachine, Pallets } from "../entities";


export interface IFitnessFunction {
    execute(population: Array<{ machine: BendMachine, pallet: Pallets }>): number;
}