import type { BendMachine, Pallets } from "../entities";

export abstract class AlgorithmicInidividual {
    individual!: {
        machine: BendMachine,
        pallet: Pallets
    }[];
    fitness: number = 0;

    abstract toString(): string;
}