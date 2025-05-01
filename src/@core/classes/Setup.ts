export class BendSetup {
    constructor(private setUpId: number, private costTime: number, private removalTime: number) { }

    getSetupRemovalTime(): number {
        return this.removalTime;
    }

    getSetUpId(): number {
        return this.setUpId;
    }

    getSetupCost(): number {
        return this.costTime;
    }
}