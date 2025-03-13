export class BendSetup {
    constructor(private setUpId: number, private costTime: number){}

    getSetUpId():number{
        return this.setUpId;
    }

    getSetupCost():number{
        return this.costTime;
    }
}