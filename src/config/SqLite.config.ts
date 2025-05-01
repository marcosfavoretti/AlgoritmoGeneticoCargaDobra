import { DataSource } from "typeorm";
import { Item, BendMachine, Machine, Operation, Pallets, Setup, ManagerPallets } from "../@core/entities/__entities.export";
import { Tools } from "../@core/entities/Tools.entity";

export class SqLiteConfig {
    async connect(): Promise<DataSource> {
        const dataSource = new DataSource({
            type: 'sqlite',
            logging: ['error'],
            synchronize: true,
            database: String(process.env.SQLITEDATABASE),
            entities: [Item, ManagerPallets, Tools, Operation, Setup, Pallets, Machine, BendMachine],
        });
        if (!dataSource.isInitialized) {
            await dataSource.initialize()
                .then(() => console.log('sqlite connected'));
        }
        return dataSource;
    }
}