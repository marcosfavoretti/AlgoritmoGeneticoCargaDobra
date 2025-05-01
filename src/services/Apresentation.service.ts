import { compile } from "handlebars";
import { main } from "..";
import type {  Pallets } from "../@core/entities/__entities.export";
import * as path from 'path'
import type { specificPopulation } from "./GeneticAlgorithmic.service";

export async function apresentationService(): Promise<string> {
    const bestResult = await main();

    const reduceFn = (bestIndividual: specificPopulation): Map<string, Array<Pallets>> => {
        const map = new Map<string, Array<Pallets>>();
        for (const unit of bestIndividual.individual) {
            if (!map.has(unit.machine.getModel())) {
                map.set(unit.machine.model, [unit.pallet]);
                continue;
            }
            map.set(unit.machine.getModel(), [...map.get(unit.machine.model)!, (unit.pallet)]);
        }
        return map;
    }
    const result = reduceFn(bestResult)
    const mapObj = result.entries().map(([K, v]) => {
        return {
            model: K,
            queue: v
        }
    });

    const data: {
        fitness: string
        result: { model: string, queue: Pallets[] }[]
    } = {
        fitness: (bestResult.fitness).toFixed(4),
        result: Array.from(mapObj)
    }
    const templateFile = await import('fs/promises')
        .then(fs => fs.readFile(path.resolve(__dirname, '../view', 'template.html'), 'utf-8'));
    const template = compile(templateFile);

    return template(data);
}

