import express from "express";
import { apresentationService } from "./services/Apresentation.service";
import { config } from "dotenv";
config();

const app = express();
const host = process.env.HOST || "localhost";
const port = Number(process.env.PORT) || 3000;

app.get("/", async (_req: express.Request, res: express.Response) => {
    // Dados para o template
    const apresentation = await apresentationService();
    res.setHeader("Content-Type", "text/html");
    res.send(apresentation);
});

app.listen(port, host, (err) => {
    if(err) throw err;
    console.log(`Servidor rodando em http://${host}:${port}`);
});
