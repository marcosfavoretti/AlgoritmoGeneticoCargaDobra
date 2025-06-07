import type { AlgorithmicInidividual } from "../@core/classes/AlgorithmicIndividual";
import type { GeneticAlgorithConfig } from "../@core/classes/GeneticAlgorithConfig";
import type { Pallets, BendMachine } from "../@core/entities";
import type { IHeuristicSolution } from "../@core/interfaces/IHeuristicSolution";

export class GeneticAlgorithmicService implements IHeuristicSolution {

    private population: AlgorithmicInidividual[] = [];
    private readonly debug = false;
    private readonly maxCrossoverRetries = 5;

    constructor(
        private config: GeneticAlgorithConfig
    ) {
        this.population = Array.from({ length: this.config.populationSize }, () => this.generateIndividual());
    }

    public run(): AlgorithmicInidividual {
        console.time('GENETIC')
        for (let i = 0; i < this.config.interaction; i++) {
            this.fitness(this.population);
            this.rankPopulation();

            const [best] = this.population;
            const tournamentWinner = this.tournamentSelection(2);
            const [a, b] = this.crossOverSafe({ a: best, b: tournamentWinner });

            this.mutation(a);
            this.mutation(b);

            this.fitness([a, b]);
            this.switchWorst({ childA: a, childB: b });

            this.rankPopulation();

            if (!this.population.every(this.isIndividualValid.bind(this))) {
                throw new Error("POPULAÇÃO COM BUG");
            }

            // if (this.isPopulationConverged()) {
            //     return this.population[0];
            // }

            if (this.debug) {
                console.log(`Iteração ${i}: Best fitness = ${this.population[0].fitness}`);
            }
        }
        console.timeEnd('GENETIC')

        return this.population[0];
    }

    private switchWorst(children: { childA: AlgorithmicInidividual, childB: AlgorithmicInidividual }): void {
        const lastIndex = this.population.length - 1;
        const secondLastIndex = this.population.length - 2;
        this.population[lastIndex] = children.childA;
        this.population[secondLastIndex] = children.childB;
    }

    private tournamentSelection(tournamentSize: number = 3): AlgorithmicInidividual {
        const tournament = Array.from({ length: tournamentSize }, () =>
            this.population[Math.floor(Math.random() * this.population.length)]
        );
        return tournament.reduce((best, current) => (current.fitness > best.fitness ? current : best));
    }

    private rankPopulation(): void {
        this.population.sort((a, b) => a.fitness - b.fitness);
    }

    private generateIndividual(): AlgorithmicInidividual {
        const input: { machine: BendMachine, pallet: Pallets }[] = [];

        for (const pallet of this.config.dataset.pallets) {
            const machine = this.config.dataset.machines[
                Math.floor(Math.random() * this.config.dataset.machines.length)
            ];
            input.push({ machine, pallet });
        }

        return { individual: input, fitness: 0 };
    }

    private fitness(targets: AlgorithmicInidividual[]): void {
        for (const target of targets) {
            const result = this.config.fitnessFunction.execute(target.individual);
            target.fitness = result;
        }
    }

    private isPopulationConverged(): boolean {
        const similarityThreshold = 0.8;
        const populationSize = this.population.length;

        const uniqueHashes = new Set(
            this.population.map(ind => this.hashIndividual(ind))
        );

        const similarityRatio = (populationSize - uniqueHashes.size) / populationSize;
        return similarityRatio >= similarityThreshold;
    }

    private hashIndividual(ind: AlgorithmicInidividual): string {
        return ind.individual
            .map(g => `${g.machine.getModel()}-${g.pallet.getId()}`)
            .join('|');
    }

    private isIndividualValid(ind: AlgorithmicInidividual): boolean {
        return ind.individual.length === this.config.dataset.pallets.length;
    }
    private crossOverSafe(parents: { a: AlgorithmicInidividual, b: AlgorithmicInidividual }): AlgorithmicInidividual[] {
        let lastValid: AlgorithmicInidividual[] | null = null;

        for (let i = 0; i < this.maxCrossoverRetries; i++) {
            const [child1, child2] = this.crossOver(parents);

            const valid1 = this.isIndividualValid(child1);
            const valid2 = this.isIndividualValid(child2);

            if (valid1 && valid2) {
                return [child1, child2];
            }
            if (valid1 || valid2) {
                lastValid = [
                    valid1 ? child1 : this.generateIndividual(),
                    valid2 ? child2 : this.generateIndividual()
                ];
            }
        }
        if (lastValid) {
            return lastValid;
        }
        return [this.generateIndividual(), this.generateIndividual()];
    }

    private crossOver(parents: { a: AlgorithmicInidividual, b: AlgorithmicInidividual }): AlgorithmicInidividual[] {
        const parentLength = this.config.dataset.pallets.length;
        const cutPoint = Math.floor(parentLength / 3) + Math.floor(Math.random() * (parentLength / 3));

        const aGenes = parents.a.individual.slice(0, cutPoint);
        const bGenes = parents.b.individual.slice(0, cutPoint);

        const aPallets = new Set(aGenes.map(g => g.pallet));
        const bPallets = new Set(bGenes.map(g => g.pallet));

        const child1 = [
            ...aGenes,
            ...parents.b.individual.filter(gene => !aPallets.has(gene.pallet))
        ];
        const child2 = [
            ...bGenes,
            ...parents.a.individual.filter(gene => !bPallets.has(gene.pallet))
        ];

        return [
            { fitness: 0, individual: child1 },
            { fitness: 0, individual: child2 }
        ];
    }

    private mutation(child: AlgorithmicInidividual): void {
        const indiceA = Math.floor(Math.random() * child.individual.length);
        const indiceB = Math.floor(Math.random() * child.individual.length);
        const indiceC = Math.floor(Math.random() * child.individual.length);

        if (Math.random() < this.config.mutationRate) {
            // swap de pallets
            [child.individual[indiceA], child.individual[indiceB]] = [child.individual[indiceB], child.individual[indiceA]];
        }

        // mutação de máquina
        if (Math.random() < 0.1) {
            const newMachine = this.config.dataset.machines[Math.floor(Math.random() * this.config.dataset.machines.length)];
            child.individual[indiceC].machine = newMachine;
        }
    }

}
