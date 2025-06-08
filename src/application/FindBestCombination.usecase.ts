import { SqLiteConfig } from "../config/SqLite.config";
import { AntColonyService } from "../services/AntColony.service";
import { GeneticAlgorithmicService } from "../services/GeneticAlgorithmic.service";
import type { AlgorithmicInidividual } from "../@core/classes/AlgorithmicIndividual";
import { FitnessMachineAndPallet } from "../@core/classes/FitnessMachineAndPallet";
import { BendMachine, Machine, Pallets } from "../@core/entities";
import { OPERATIONS } from "../@core/enums/OPERATIONS.enum";
import { ExhaustiveSearchService } from "../services/ExhaustiveSearch.service";

export class FindBestCombinationUseCase {
    private readonly globalIteraction: number = 5;
    private bestIndividual?: AlgorithmicInidividual;

    async execute(): Promise<AlgorithmicInidividual> {
        const sqlite = await new SqLiteConfig().connect();
        let machines = await sqlite.getRepository(Machine).find({
            where: {
                operation: OPERATIONS.DOBRA
            }
        })
        let pallets = await sqlite.getRepository(Pallets).find({
            relations: {
                managerPallets: {
                    item: {
                        operation: true,
                        setup: {
                            toolName: true
                        },
                    },
                }
            }
        });
        // pallets = pallets.slice(0, 7);
        // const result3 = new ExhaustiveSearchService(
        //     {
        //         dataset: {
        //             machines: machines as BendMachine[],
        //             pallets: pallets
        //         },
        //         fitnessFunction: new FitnessMachineAndPallet(),
        //         interaction: 100,
        //         populationSize: 50,
        //         mutationRate: 0.3
        //     }

        // ).run();
        for (const _ of Array(this.globalIteraction)) {
            const [result1, result2] = await Promise.all([
                new GeneticAlgorithmicService({
                    dataset: {
                        machines: machines as BendMachine[],
                        pallets: pallets
                    },
                    fitnessFunction: new FitnessMachineAndPallet(),
                    interaction: 100,
                    populationSize: 50,
                    mutationRate: 0.3
                }
                ).run(),
                new AntColonyService({
                    dataset: {
                        machines: machines as BendMachine[],
                        pallets: pallets
                    },
                    fitnessFunction: new FitnessMachineAndPallet(),
                    interaction: 100,
                    populationSize: 50,
                    evaporationRate: 0.1
                }).run(),
            ]);

            let bestInItenraction: AlgorithmicInidividual;
            let algoritmorespose: string = '';
            console.log(`Responsta do Algoritmo AG ${result1.fitness}`)
            console.log(`Responsta do Algoritmo ACO ${result2.fitness}`)

            if (result1.fitness < result2.fitness) {
                bestInItenraction = result1;
                algoritmorespose = 'AG'
            }
            else {
                bestInItenraction = result2;
                algoritmorespose = 'ACO'
            }
            if ((this.bestIndividual?.fitness ?? Infinity) > bestInItenraction.fitness) {
                this.bestIndividual = bestInItenraction;
                console.log(algoritmorespose, 'venceu essa rodada', this.bestIndividual.fitness.toFixed(4));
            }
        }
        // console.log(`Responsta do Algoritmo Força bruta ${result3.fitness}`)
        return this.bestIndividual!;
    }
}