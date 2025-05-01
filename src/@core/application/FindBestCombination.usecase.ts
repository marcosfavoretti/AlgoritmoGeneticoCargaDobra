import { SqLiteConfig } from "../../config/SqLite.config";
import { AntColonyService } from "../../services/AntColony.service";
import { GeneticAlgorithmicService } from "../../services/GeneticAlgorithmic.service";
import type { AlgorithmicInidividual } from "../classes/AlgorithmicIndividual";
import { FitnessMachineAndPallet } from "../classes/FitnessMachineAndPallet";
import { BendMachine, Machine, Pallets } from "../entities";
import { OPERATIONS } from "../enums/OPERATIONS.enum";

export class FindBestCombinationUseCase {
    private readonly globalIteraction: number = 20;
    private bestIndividual?: AlgorithmicInidividual;

    async execute(): Promise<AlgorithmicInidividual> {
        const sqlite = await new SqLiteConfig().connect();
        let machines = await sqlite.getRepository(Machine).find({
            where: {
                operation: OPERATIONS.DOBRA
            }
        })
        const pallets = await sqlite.getRepository(Pallets).find({
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

        for (const _ of Array(this.globalIteraction)) {
            const [resul1, result2] = await Promise.all([
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
                }).run()
            ]);
            let bestInItenraction: AlgorithmicInidividual;
            let algoritmorespose: string = '';
            if (resul1.fitness < result2.fitness) {
                bestInItenraction = resul1;
                algoritmorespose = 'genetic'
            }
            else {
                bestInItenraction = result2;
                algoritmorespose = 'formiga'
            }
            if((this.bestIndividual?.fitness ?? Infinity) > bestInItenraction.fitness){
                this.bestIndividual = bestInItenraction;
                console.log(algoritmorespose, 'ta como melhor com o fitness', this.bestIndividual.fitness);
            }
        }
        return this.bestIndividual!;
    }
}