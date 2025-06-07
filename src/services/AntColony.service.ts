import type { AlgorithmicInidividual } from "../@core/classes/AlgorithmicIndividual";
import type { AntColonyAlgorithConfig } from "../@core/classes/AntColonyAlgorithConfig";
import type { BendMachine, Pallets } from "../@core/entities";
import type { IHeuristicSolution } from "../@core/interfaces/IHeuristicSolution";

type pheromoneMatrix = Map<string, Map<string, number>>; // palletId -> machineId -> pheromone

export class AntColonyService implements IHeuristicSolution {
    private pheromones: pheromoneMatrix = new Map();

    constructor(private config: AntColonyAlgorithConfig) {
        this.initializePheromones();
    }

    public run(): AlgorithmicInidividual {
        console.time('ANT COLONY')
        let bestSolution: AlgorithmicInidividual | null = null;

        for (let iter = 0; iter < this.config.interaction; iter++) {
            const ants: AlgorithmicInidividual[] = [];

            for (let i = 0; i < this.config.populationSize; i++) {
                const solution = this.constructSolution();
                solution.fitness = this.config.fitnessFunction.execute(solution.individual);
                ants.push(solution);
            }

            this.evaporatePheromones();
            this.updatePheromones(ants);

            const localBest = ants.reduce((a, b) => (a.fitness < b.fitness ? a : b));
            if (!bestSolution || localBest.fitness < bestSolution.fitness) {
                bestSolution = localBest;
            }
        }
        console.timeEnd('ANT COLONY')
        return bestSolution! ;
    }

    private initializePheromones() {
        for (const pallet of this.config.dataset.pallets) {
            const machineMap = new Map<string, number>();
            for (const machine of this.config.dataset.machines) {
                machineMap.set(machine.getModel(), 1.0); // valor inicial
            }
            this.pheromones.set(String(pallet.getId()), machineMap);
        }
    }

    private constructSolution(): AlgorithmicInidividual {
        const individual: { machine: BendMachine; pallet: Pallets }[] = [];

        for (const pallet of this.config.dataset.pallets) {
            const chosenMachine = this.selectMachine(pallet);
            individual.push({ pallet, machine: chosenMachine });
        }

        return { individual, fitness: 0 };
    }

    private selectMachine(pallet: Pallets): BendMachine {
        const pheromoneRow = this.pheromones.get(String(pallet.getId()))!;
        const machines = this.config.dataset.machines;

        const probabilities = machines.map(machine => {
            const pheromone = pheromoneRow.get(machine.getModel())!;
            return { machine, value: pheromone };
        });
        //roleta
        const total = probabilities.reduce((acc, p) => acc + p.value, 0);
        const rand = Math.random() * total;
        let sum = 0;

        for (const { machine, value } of probabilities) {
            sum += value;
            if (sum >= rand) return machine;
        }

        return machines[machines.length - 1]; // fallback
    }

    private evaporatePheromones() {
        for (const [palletId, machineMap] of this.pheromones.entries()) {
            for (const [machineId, value] of machineMap.entries()) {
                machineMap.set(machineId, value * (1 - this.config.evaporationRate!));
            }
        }
    }

    private updatePheromones(ants: AlgorithmicInidividual[]) {
        const eliteAnts = ants.sort((a, b) => b.fitness - a.fitness).slice(0, 5);

        for (const ant of eliteAnts) {
            for (const gene of ant.individual) {
                const palletId = gene.pallet.getId();
                const machineId = gene.machine.getModel();
                const current = this.pheromones.get(String(palletId))!.get(machineId)!;
                this.pheromones.get(String(palletId))!.set(machineId, current + ant.fitness);
            }
        }
    }

    private isConverged(ants: AlgorithmicInidividual[]): boolean {
        const threshold = 0.8;
        const unique = new Set(
            ants.map(a => JSON.stringify(a.individual.map(g => ({
                machine: g.machine.getModel(),
                pallet: g.pallet.getId()
            }))))
        );
        return (this.config.populationSize - unique.size) / this.config.populationSize >= threshold;
    }
}
