import { DataSource } from "typeorm";
import { Pallets } from "../@core/entities/Pallets.entity";
import { PalletsMongoDB } from "../export.script";
export class MongoDataBaseConfig {
    async connect(): Promise<DataSource> {
        const dt = new DataSource({
            type: 'mongodb',
            authSource: 'admin', // Ou o banco de dados correto para autenticação
            database : process.env.MONGODATABASE,
            host: process.env.MONGOHOST,
            username: process.env.MONGOUSER,
            entities: [PalletsMongoDB],
            password: process.env.MONGOPWD,
            synchronize: false,
            logging: false,
        });
        await dt.initialize()
            .then(()=> console.log('mongo connected'));
        return dt;
    }
}