import { FindBestCombinationUseCase } from "./application/FindBestCombination.usecase";

(async () => {
    try {
        await new FindBestCombinationUseCase().execute()
        console.log('FINALIZADO')
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao executar solução')
    }
})();


