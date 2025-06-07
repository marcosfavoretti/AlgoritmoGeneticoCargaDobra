import { FindBestCombinationUseCase } from "./application/FindBestCombination.usecase";

(async () => {
    try {
        await new FindBestCombinationUseCase().execute()

    } catch (error) {
        console.error(error);
        throw new Error('Erro ao executar solução')
    }
})();


