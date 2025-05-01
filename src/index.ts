import { FitnessMachineAndPallet } from "./@core/classes/FitnessMachineAndPallet";
import { Pallets, Machine, BendMachine } from "./@core/entities/__entities.export";
import { OPERATIONS } from "./@core/enums/OPERATIONS.enum";
import { SqLiteConfig } from "./config/SqLite.config"
import { GeneticAlgorithmicService, type specificPopulation } from "./services/GeneticAlgorithmic.service";

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
    const interaction = 1;
    let bestresult!: specificPopulation;
    for (let i = 0; interaction > i; i++) {
        const algoritmo = new GeneticAlgorithmicService({
            dataset: {
                machines: machines as BendMachine[],
                pallets: pallets
            },
            fitnessFunction: new FitnessMachineAndPallet(),
            interaction: 400,
            populationSize: 5,
            mutationRate: 0.5
        })
        const result = algoritmo.run();
        if (i === 0) {
            bestresult = result[0];
        }
        bestresult = (result[0].fitness < bestresult.fitness ? result[0] : bestresult);
    }
    console.log(`Top result:`);
    console.dir({
        ind: bestresult.individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } }), fit: bestresult.fitness
    }, { depth: 4 });
    
    return bestresult;
}



