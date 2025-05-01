
import type { Pallets, BendMachine } from "../@core/entities/__entities.export";
import type { IFitnessFunction } from "../@core/interfaces/IFitnessFunction";

type algorithmicProps = {
    interaction: number;
    populationSize: number;
    dataset: specificDatasetType;
    fitnessFunction: IFitnessFunction;
    mutationRate: number;
}
export type specificDatasetType = {
    machines: BendMachine[];
    pallets: Pallets[]
}
export type specificPopulation = {
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
            this.fitness(this.population);
            this.rankPopulation();
            const [best, ..._] = this.population;
            const tournamentWinner = this.tournamentSelection(2);
            const [a, b] = this.crossOver({
                a: best,
                b: tournamentWinner
            });
            this.mutation(a);
            this.mutation(b);
            this.fitness(
                [a, b]
            );
            this.switchWorst({ childA: a, childB: b });
            this.rankPopulation()
            if (this.population.some(a => a.individual.length !== this.config.dataset.pallets.length)) {
                throw new Error('POPULACAO COM BUG')
            }
            if (this.isPopulationConverged()) {
                console.log('populacao convergiu')
                return this.population;
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

    private tournamentSelection(tournamentSize: number = 3): specificPopulation {
        // Seleciona aleatoriamente `tournamentSize` indivíduos
        const tournament = Array.from({ length: tournamentSize }, () =>
            this.population[Math.floor(Math.random() * this.population.length)]
        );

        // Retorna o melhor (maior fitness)
        return tournament.reduce((best, current) => (current.fitness > best.fitness ? current : best));
    }

    private rankPopulation(): void {
        this.population.sort((a, b) => a.fitness - b.fitness);
        // console.log(`best one ${this.population[0].fitness} | `, this.population[0].individual.map(a => { return { m: a.machine.getModel(), p: a.pallet.getId() } }))
    }

    private generateIndividual(): specificPopulation {
        const input: { machine: BendMachine, pallet: Pallets }[] = [];
        for (const pallet of this.config.dataset.pallets) {
            // console.log(this.config.dataset.machines)
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
    private isPopulationConverged(): boolean {
        const similarityThreshold = 0.8;
        const populationSize = this.population.length;

        const uniqueIndividuals = new Set(
            this.population.map(individual =>
                JSON.stringify(individual.individual.map(gene => ({
                    machine: gene.machine.getModel(),
                    pallet: gene.pallet.getId()
                })))
            )
        );

        const similarityRatio = (populationSize - uniqueIndividuals.size) / populationSize;
        return similarityRatio >= similarityThreshold;
    }

    crossOver(parents: { a: specificPopulation, b: specificPopulation }): specificPopulation[] {
        const parentLength = this.config.dataset.pallets.length;

        // Melhor ponto de corte para evitar extremos
        const cutPoint = Math.floor(parentLength / 3) + Math.floor(Math.random() * (parentLength / 3));
        const aGenes = parents.a.individual.slice(0, cutPoint);
        const bGenes = parents.b.individual.slice(0, cutPoint);

        // Otimizar a busca por duplicação com um Set
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

        // Garante que ambos os filhos tenham tamanho correto
        if (child1.length !== parentLength || child2.length !== parentLength) {
            console.warn("Crossover gerou filhos inválidos, refazendo...");
            return this.crossOver(parents);
        }

        return [
            { fitness: 0, individual: child1 },
            { fitness: 0, individual: child2 }
        ];
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