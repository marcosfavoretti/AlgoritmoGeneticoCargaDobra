import { Repository, DataSource } from "typeorm";
import { Pallets } from "../@core/entities/Pallets.entity";

export class PalletsRepostiory extends Repository<Pallets> {
    constructor(dt: DataSource) {
        super(Pallets, dt.createEntityManager());
    }
}