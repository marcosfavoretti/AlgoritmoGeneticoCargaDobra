/**
 * Brute‐force exhaustive search implementation of IHeuristicSolution.
 * Tests all permutations of pallet sequences and all assignments of pallets to machines.
 * WARNING: Complexity is O(n!·2^n) — becomes infeasible for n > 10.
 */
import type { AlgorithmicInidividual } from "../@core/classes/AlgorithmicIndividual";
import type { GeneticAlgorithConfig } from "../@core/classes/GeneticAlgorithConfig";
import type { Pallets, BendMachine } from "../@core/entities";
import type { IHeuristicSolution } from "../@core/interfaces/IHeuristicSolution";

export class ExhaustiveSearchService implements IHeuristicSolution {
  private bestSolution: AlgorithmicInidividual = { individual: [], fitness: Infinity };
  private pallets: Pallets[];
  private machines: BendMachine[];

  constructor(private config: GeneticAlgorithConfig) {
    this.pallets = [...config.dataset.pallets];
    this.machines = config.dataset.machines;
  }

  public run(): AlgorithmicInidividual {
    // Start the full enumeration
    console.time('Força bruta')
    this.permute(this.pallets, 0);
    console.timeEnd('Força bruta')
    return this.bestSolution;
  }

  /**
   * Generates all permutations of the pallets array (in place) via backtracking.
   */
  private permute(arr: Pallets[], l: number) {
    if (l === arr.length) {
      this.evaluateAssignments(arr);
    } else {
      for (let i = l; i < arr.length; i++) {
        [arr[l], arr[i]] = [arr[i], arr[l]];
        this.permute(arr, l + 1);
        [arr[l], arr[i]] = [arr[i], arr[l]];
      }
    }
  }

  /**
   * For a given fixed sequence, tries every combination of machine assignments
   * (2^n possibilities) and updates the bestSolution if fitness improves.
   */
  private evaluateAssignments(order: Pallets[]) {
    const n = order.length;
    const total = 1 << n; // 2^n bitmasks
    for (let mask = 0; mask < total; mask++) {
      const individual = order.map((pallet, idx) => ({
        pallet,
        machine: this.machines[(mask >> idx) & 1],
      }));
      const fitness = this.config.fitnessFunction.execute(individual);
      if (fitness < this.bestSolution.fitness) {
        this.bestSolution = { individual, fitness };
      }
    }
  }
}
