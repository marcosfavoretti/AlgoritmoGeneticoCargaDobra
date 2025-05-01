import type { AlgorithmicInidividual } from "../classes/AlgorithmicIndividual";

export interface IHeuristicSolution{
    run(): AlgorithmicInidividual
}