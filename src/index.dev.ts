import { BendMachine } from "./@core/classes/BendMachine.ts";
import { FitnessMachineAndPallet } from "./@core/classes/FitnessMachineAndPallet.ts";
import { Item } from "./@core/classes/Item.ts";
import { Pallets } from "./@core/classes/Pallet.ts";
import { BendSetup } from "./@core/classes/Setup.ts";
import { OPERATIONS } from "./@core/enums/OPERATIONS.enum.ts";
import { SqLiteConfig } from "./config/SqLite.config.ts";
import { GeneticAlgorithmicService, type specificPopulation } from "./services/GeneticAlgorithmic.service.ts";


const setupA = new BendSetup(1, 12.22, 2)
const setupB = new BendSetup(2, 20.42,1)
const setupC = new BendSetup(3, 5.42,4)
const sqlite = await new SqLiteConfig();
await sqlite.connect();
const itens = [
    new Item('A', {
        operationMap: new Map([
            [OPERATIONS.DOBRA, 4.2]
        ])
    }, setupA),
    new Item('B', {
        operationMap: new Map([
            [OPERATIONS.DOBRA, 5.2]
        ])
    }, setupC),
    new Item('C', {
        operationMap: new Map([
            [OPERATIONS.DOBRA, 10.2]
        ])
    }, setupB),
    new Item('D', {
        operationMap: new Map([
            [OPERATIONS.DOBRA, 8.2]
        ])
    }, setupB)
]
const interaction = 30;
let bestresult!: specificPopulation;
for (let i = 0; interaction > i; i++) {
    const genetic = new GeneticAlgorithmicService({
        dataset: {
            machines: [
                new BendMachine('LVD', 0.5, 0.2),
                new BendMachine('GASPARINIV2', 0.75, 0.75),
                new BendMachine('GASPARINI'),
                new BendMachine('LVD2', 0.2, 0.1)
            ]
            , pallets: [
                new Pallets(1, [itens[0], itens[1]]),
                new Pallets(2, [itens[2]]),
                new Pallets(3, [itens[3]]),
                new Pallets(4, [itens[0], itens[1], itens[3], itens[3], itens[3], itens[3]]),
                new Pallets(5, [itens[0], itens[1]]),
                new Pallets(6, [itens[0], itens[1]]),
            ]
        },
        fitnessFunction: new FitnessMachineAndPallet(),
        interaction: 1_000,
        populationSize: 100,
        mutationRate: 0.1
    })
    const result = genetic.run();
    // console.log(`melhor da interacao ${i}`);
    // console.dir({
    //     ind: result[0].individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } }), fit: result[0].fitness
    // }, { depth: 4 })
    if (i === 0) {
        bestresult = result[0];
    }
    bestresult = (result[0].fitness < bestresult.fitness ? result[0] : bestresult);
}
// console.dir(result.map(a => {
//     return {
//         ind: a.individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } }), fit: a.fitness
//     }
// }), { depth: 4 });
console.log(`melhor de todasssssssss`);
console.dir({
    ind: bestresult.individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } }), fit: bestresult.fitness
}, { depth: 4 });

console.log('up command');
