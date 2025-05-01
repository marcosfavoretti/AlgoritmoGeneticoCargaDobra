import express from "express";
import { apresentationService } from "./services/Apresentation.service";

const app = express();
const port = 3002;

app.get("/", async (_req: express.Request, res: express.Response) => {
    // Dados para o template
    const apresentation = await apresentationService();
    res.setHeader("Content-Type", "text/html");
    res.send(apresentation);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
