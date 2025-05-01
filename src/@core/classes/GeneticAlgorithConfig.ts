import type { IFitnessFunction } from "../interfaces/IFitnessFunction";
import type { Dataset } from "./Dataset";

export class GeneticAlgorithConfig {
    interaction!: number;
    populationSize!: number;
    dataset!: Dataset;
    fitnessFunction!: IFitnessFunction;
    mutationRate!: number;
}