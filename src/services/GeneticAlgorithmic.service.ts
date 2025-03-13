import type { BendMachine } from "../@core/classes/BendMachine";
import type { Pallets } from "../@core/classes/Pallet";
import type { IFitnessFunction } from "../@core/interfaces/IFitnessFunction";

type algorithmicProps = {
    interaction: number;
    populationSize: number;
    dataset: specificDatasetType;
    fitnessFunction: IFitnessFunction;
    mutationRate: number;
}
type specificDatasetType = {
    machines: BendMachine[];
    pallets: Pallets[]
}
type specificPopulation = {
    individual: { machine: BendMachine, pallet: Pallets }[];
    fitness: number;
}
export class GeneticAlgorithmicService {

    private population: specificPopulation[] = [];

    constructor(
        private config: algorithmicProps
    ) {
        this.population = Array(this.config.populationSize)
            .fill(null)
            .map(() => this.generateIndividual());
        console.log('population generated');
    }

    public run(): specificPopulation[] {
        for (let i = 0; this.config.interaction > i; i++) {
            // console.log(`=-=-=-=-=-interaction ${i}=-=-=-=-=-`);
            this.fitness(this.population);
            this.rankPopulation();
            const [best, sndbest, ..._] = this.population;
            const [a, b] = this.crossOver({
                a: best,
                b: sndbest
            });
            this.fitness(
                [a, b]
            );
            this.mutation(a);
            this.mutation(b);
            this.switchWorst({ childA: a, childB: b });
            this.rankPopulation()
            if (this.population.some(a => a.individual.length !== this.config.dataset.pallets.length)) {
                throw new Error('POPULACAO COM BUG')
            }
        }
        return this.population;
    }

    private switchWorst(children: { childA: specificPopulation, childB: specificPopulation }): void {
        const lastIndex = this.population.length - 1;
        const secondLastIndex = this.population.length - 2;
        this.population[lastIndex] = children.childA;
        this.population[secondLastIndex] = children.childB;
    }

    private rankPopulation(): void {
        this.population.sort((a, b) => a.fitness - b.fitness);
    }

    private generateIndividual(): specificPopulation {
        const input: { machine: BendMachine, pallet: Pallets }[] = [];
        for (const pallet of this.config.dataset.pallets) {
            const machine = this.config.dataset.machines[
                Math.floor(Math.random() * this.config.dataset.machines.length)
            ];
            input.push({ machine, pallet });
        }
        return { individual: input, fitness: 0 };
    }

    private fitness(targets: specificPopulation[]): void {
        for (const target of targets) {
            const result = this.config.fitnessFunction.execute(target.individual);
            target.fitness = result;
        }
    }

    crossOver(parents: { a: specificPopulation, b: specificPopulation }): specificPopulation[] {
        const parentLength = this.config.dataset.pallets.length;
        const cutPoint = Math.floor(Math.random() * (parentLength - 1)) + 1; // Garante que cutPoint está entre 1 e length-1
        const aGenes = parents.a.individual.slice(0, cutPoint);
        const bGenes = parents.b.individual.slice(0, cutPoint);
        const child1 = [
            ...aGenes,
            ...parents.b.individual.filter(gene => !aGenes.map(g => g.pallet).includes(gene.pallet))
        ];
        const child2 = [
            ...bGenes,
            ...parents.a.individual.filter(gene => !bGenes.map(g => g.pallet).includes(gene.pallet))
        ];
        return [
            { fitness: 0, individual: child1 },
            { fitness: 0, individual: child2 }
        ]
    }

    mutation(child: specificPopulation): void {
        const indiceA = Math.floor(Math.random() * child.individual.length);
        const indiceB = Math.floor(Math.random() * child.individual.length);
        const indiceC = Math.floor(Math.random() * child.individual.length);
        // console.log('indices para mutacao', indiceA, indiceB);
        if (Math.random() < this.config.mutationRate) {
            [child.individual[indiceB], child.individual[indiceA]] = [child.individual[indiceA], child.individual[indiceB]];
        }
        // 10% chance to mutate the machine
        // child.individual[indiceC].machine = this.config.dataset.machines[Math.floor(Math.random() * this.config.dataset.machines.length)];
    }

}