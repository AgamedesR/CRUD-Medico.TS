import express, { Express } from "express";
import cors from "cors";
import routes from "./routes"; // importa o index.ts da pasta routes
import { setupSwagger } from "./swagger";

const app: Express = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use(routes);

// Swagger
setupSwagger(app);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📘 Swagger disponível em http://localhost:${port}/api-docs`);
});


app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.send('API Clínica rodando! 🚀');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
