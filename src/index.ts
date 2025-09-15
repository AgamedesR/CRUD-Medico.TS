import express from "express";
import type { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 3000;

app.use(express.json());

type Medico = {
    crm: number;
    nome: string;
    especialidade: string;
}

const medicos: Medico[] = [
    { 
        crm: 111111, 
        nome: "Dr. Fulano", 
        especialidade: "Cardiologia" 
    },

    { 
        crm: 222222, 
        nome: "Dr. Sicrano", 
        especialidade: "Dermatologia" 
    },

    {
        crm: 333333,
        nome: "Dra. Beltrana",
        especialidade: "Pediatria"
    }
];

// Find All
app.get("/medicos", (req: Request, res: Response) => {
    res.json(medicos);
});

// Find One
app.get("/medicos/:crm", (req: Request, res: Response) => { 
    const crmParam = req.params.crm;
    if (!crmParam) {
        return res.status(400).json({ error: "CRM não fornecido." });
    }
    const crm: number = parseInt(crmParam, 10);

    // Validar se o CRM é um número de 6 dígitos
    if (isNaN(crm) || crm < 100000 || crm > 999999) {
        return res.status(400).json({ error: "CRM inválido. Deve ser um número de 6 dígitos." });
    }

    const medico = medicos.find(m => m.crm === crm);

    if (!medico) {
        return res.status(404).json({ error: "Médico não encontrado." });
    }
    res.json(medico);
});

// Create
app.post("/medicos", (req: Request, res: Response) => {
    const { crm, nome, especialidade } = req.body;

    if (typeof crm !== "number" || typeof nome !== "string" || typeof especialidade !== "string") {
        return res.status(400).json({ error: "O CRM é obrigatóriamente um número inteiro positivo com 6 digítos." });
    }

    if (typeof nome !== 'string' || nome.trim() === "") {
        return res.status(400).json({ message: "O nome é obrigatório e não pode estar vazio." });
    }

    if (typeof especialidade !== 'string' || especialidade.trim() === "") {
        return res.status(400).json({ message: "A especialidade é obrigatória e não pode estar vazia." });
    }

    // Busca o maior CRM já existente
    let maxCrm = 0;
    // Percorre todos os médicos cadastrados
    for (const medico of medicos) {
        if (medico.crm > maxCrm) {
            maxCrm = medico.crm;
        }
    }

    // Gera o próximo CRM (sempre +1 do maior já existente)
    const medicoWithCrm: Medico = { crm: maxCrm + 1, nome, especialidade };

    // Adiciona o novo médico ao array de médicos
    medicos.push(medicoWithCrm);
    // Retorna o novo médico criado com status
    res.status(201).json(medicoWithCrm);
});

// Update
app.put("/medicos/:crm", (req: Request, res: Response) => {
    const crmParam = req.params.crm;
    if (!crmParam) {
        return res.status(400).json({ error: "CRM não fornecido." });
    }
    const crm: number = parseInt(crmParam, 10);

    if (isNaN(crm) || crm < 100000 || crm > 999999) {
        return res.status(400).json({ error: "CRM inválido. Deve ser um número inteiro positivo de 6 dígitos." });
    }

    const medicoIndex: number = medicos.findIndex(m => m.crm === crm);
    if (medicoIndex === -1) {
        return res.status(404).json({ error: "Médico não encontrado." });
    }

    const { nome, especialidade } = req.body;
    const currentMedico: Medico = medicos[medicoIndex]!;

    if (nome !== undefined) {
        if (typeof nome !== 'string' || nome.trim() === "") {
            return res.status(400).json({ message: "O nome é obrigatório e não pode estar vazio." });
        }
        currentMedico.nome = nome;
    }

    if (especialidade !== undefined) {
        if (typeof especialidade !== 'string' || especialidade.trim() === "") {
            return res.status(400).json({ message: "A especialidade é obrigatória e não pode estar vazia." });
        }
        currentMedico.especialidade = especialidade;
    }

    if (nome === undefined && especialidade === undefined) {
        return res.status(400).json({ message: "Pelo menos um dos campos (nome ou especialidade) deve ser fornecido para atualização." });
    }

    medicos[medicoIndex] = currentMedico;
    res.json(currentMedico);

});

// Delete
app.delete("/medicos/:crm", (req: Request, res: Response) => {
    const crmParam = req.params.crm;
    if (!crmParam) {
        return res.status(400).json({ error: "CRM não fornecido." });
    }
    const crm: number = parseInt(crmParam, 10);

    if (isNaN(crm) || crm < 100000 || crm > 999999) {
        return res.status(400).json({ error: "CRM inválido. Deve ser um número de 6 dígitos." });
    }

    const medicoIndex: number = medicos.findIndex(m => m.crm === crm);
    if (medicoIndex === -1) {
        return res.status(404).json({ error: "Médico não encontrado." });
    }

    medicos.splice(medicoIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

