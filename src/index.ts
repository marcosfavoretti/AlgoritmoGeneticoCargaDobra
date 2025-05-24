import type { AlgorithmicInidividual } from "./@core/classes/AlgorithmicIndividual";
import { FitnessMachineAndPallet } from "./@core/classes/FitnessMachineAndPallet";
import { Pallets, Machine, BendMachine } from "./@core/entities";
import { OPERATIONS } from "./@core/enums/OPERATIONS.enum";
import { SqLiteConfig } from "./config/SqLite.config"
import { AntColonyService } from "./services/AntColony.service";
import { GeneticAlgorithmicService } from "./services/GeneticAlgorithmic.service";

export const main = async () => {
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
    const interaction = 3;
    let bestresult!: AlgorithmicInidividual;
    for (let i = 0; interaction > i; i++) {
        const algoritmo = new GeneticAlgorithmicService({
            dataset: {
                machines: machines as BendMachine[],
                pallets: pallets
            },
            fitnessFunction: new FitnessMachineAndPallet(),
            interaction: 400,
            populationSize: 100,
            mutationRate: 0.5
        })
        const result = algoritmo.run();

        const antes = new AntColonyService({
            dataset: {
                machines: machines as BendMachine[],
                pallets: pallets
            },
            fitnessFunction: new FitnessMachineAndPallet(),
            interaction: 400,
            populationSize: 100,
            evaporationRate: 0.1
        })
        const result2 = antes.run();
        const chose = result2.fitness > result.fitness ? result2 : result;
        if (i === 0) {
            bestresult = chose;
        }
        bestresult = (chose.fitness < bestresult.fitness ? chose : bestresult);
    }

    console.log('melhor resultado');
    console.dir(bestresult.fitness, { depth: 1 })

    // console.log(`Top result:`);
    // console.log('genetic')
    // console.dir({
    //     ind: result.individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } })
    // }, { depth: 4 });
    // console.log('formigas')
    // console.dir({
    //     ind: bestResult[0].individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } })
    // }, { depth: 4 });

    return bestresult;
}


