import { BendMachine } from "./@core/classes/BendMachine";
import { FitnessMachineAndPallet } from "./@core/classes/FitnessMachineAndPallet.ts";
import { Item } from "./@core/classes/Item";
import { Pallets } from "./@core/classes/Pallet";
import { BendSetup } from "./@core/classes/Setup";
import { OPERATIONS } from "./@core/enums/OPERATIONS.enum.ts";
import { GeneticAlgorithmicService } from "./services/GeneticAlgorithmic.service";

const machines = [
    new BendMachine('LVD', 0.5, 0.2),
    new BendMachine('GASPARINI'),
    new BendMachine('LVD2', 0.2, 0.1)
]



const setupA = new BendSetup(1, 12.22)
const setupB = new BendSetup(2, 20.42)
const setupC = new BendSetup(2, 5.42)


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


const genetic = new GeneticAlgorithmicService({
    dataset: {
        machines: machines, pallets: [
            new Pallets(1, [itens[0], itens[1]]),
            new Pallets(2, [itens[2]]),
            new Pallets(3, [itens[3]]),
            new Pallets(4, [itens[0], itens[1]]),
            new Pallets(5, [itens[0], itens[1]]),
            new Pallets(6, [itens[0], itens[1]]),
        ]
    },
    fitnessFunction: new FitnessMachineAndPallet(),
    interaction: 2_000,
    populationSize: 5,
    mutationRate: 0.3
})

const result = genetic.run();
console.dir({
    ind: result[0].individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } }), fit: result[0].fitness
}, {depth: 4})
// console.dir(result.map(a => {
//     return {
//         ind: a.individual.map(b => { return { pallet: b.pallet.getId(), machine: b.machine.getModel() } }), fit: a.fitness
//     }
// }), { depth: 4 });
console.log('up command')