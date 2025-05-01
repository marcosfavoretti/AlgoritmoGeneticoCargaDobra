import type { specificDatasetType } from "./GeneticAlgorithmic.service";

export class AntColonyService {
    private pheromones: number[][];

    constructor(
        private graph: specificDatasetType,
        private alpha: number,
        private beta: number,
        private evaporationRate: number,
        private ants: number
    ) {
        this.graph = graph;
        this.alpha = alpha;
        this.beta = beta;
        this.evaporationRate = evaporationRate;
        this.ants = ants;
        this.pheromones = Array.from({ length: graph.length }, () =>
            Array(graph.length).fill(1)
        );
    }

    public findShortestPath(iterations: number): number[] {
        let bestPath: number[] = [];
        let bestPathLength = Infinity;

        for (let iter = 0; iter < iterations; iter++) {
            const paths = this.generateAntPaths();
            const pathLengths = paths.map((path) => this.calculatePathLength(path));

            for (let i = 0; i < paths.length; i++) {
                if (pathLengths[i] < bestPathLength) {
                    bestPathLength = pathLengths[i];
                    bestPath = paths[i];
                }
            }

            this.updatePheromones(paths, pathLengths);
        }

        return bestPath;
    }

    private generateAntPaths(): number[][] {
        const paths: number[][] = [];

        for (let ant = 0; ant < this.ants; ant++) {
            const path: number[] = [];
            const visited = new Set<number>();
            let currentNode = Math.floor(Math.random() * this.graph.length);

            path.push(currentNode);
            visited.add(currentNode);

            while (path.length < this.graph.length) {
                const nextNode = this.chooseNextNode(currentNode, visited);
                path.push(nextNode);
                visited.add(nextNode);
                currentNode = nextNode;
            }

            paths.push(path);
        }

        return paths;
    }

    private chooseNextNode(currentNode: number, visited: Set<number>): number {
        const probabilities: number[] = [];
        const neighbors = this.graph[currentNode];

        for (let i = 0; i < neighbors.length; i++) {
            if (!visited.has(i)) {
                const pheromone = this.pheromones[currentNode][i];
                const distance = neighbors[i];
                probabilities[i] = Math.pow(pheromone, this.alpha) * Math.pow(1 / distance, this.beta);
            } else {
                probabilities[i] = 0;
            }
        }

        const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
        const random = Math.random() * totalProbability;

        let cumulative = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (random <= cumulative) {
                return i;
            }
        }

        return -1; // Should not reach here
    }

    private calculatePathLength(path: number[]): number {
        let length = 0;

        for (let i = 0; i < path.length - 1; i++) {
            length += this.graph[path[i]][path[i + 1]];
        }

        length += this.graph[path[path.length - 1]][path[0]]; // Return to start
        return length;
    }

    private updatePheromones(paths: number[][], pathLengths: number[]): void {
        for (let i = 0; i < this.pheromones.length; i++) {
            for (let j = 0; j < this.pheromones[i].length; j++) {
                this.pheromones[i][j] *= 1 - this.evaporationRate;
            }
        }

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const length = pathLengths[i];

            for (let j = 0; j < path.length - 1; j++) {
                const from = path[j];
                const to = path[j + 1];
                this.pheromones[from][to] += 1 / length;
                this.pheromones[to][from] += 1 / length;
            }

            const start = path[0];
            const end = path[path.length - 1];
            this.pheromones[start][end] += 1 / length;
            this.pheromones[end][start] += 1 / length;
        }
    }
}