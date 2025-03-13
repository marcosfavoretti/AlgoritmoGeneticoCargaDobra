import type { BendMachine } from "../classes/BendMachine";
import type { Pallets } from "../classes/Pallet";

export interface IFitnessFunction {
    execute(population: Array<{ machine: BendMachine, pallet: Pallets }>): number;
}