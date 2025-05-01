import type { IFitnessFunction } from "../interfaces/IFitnessFunction";
import type { Dataset } from "./Dataset";

export class AntColonyAlgorithConfig {
    interaction!: number;
    populationSize!: number;
    dataset!: Dataset;
    fitnessFunction!: IFitnessFunction;
    evaporationRate?: number = 0.1;
}