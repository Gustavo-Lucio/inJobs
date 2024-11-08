const express = require('express');
const router = express.Router();
const connectDB = require('../config/db'); // Certifique-se de ajustar o caminho conforme necessário

// Rota para obter todas as vagas
router.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const jobsCollection = db.collection('jobs');
        const jobs = await jobsCollection.find({}).toArray();
        res.json(jobs);
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
});

// Rota para criar uma nova vaga
router.post('/', async (req, res) => {
    try {
        const db = await connectDB();
        const jobsCollection = db.collection('jobs');

        // Desestruturando todos os campos do corpo da requisição
        const { 
            job_title, 
            job_description, 
            company_id, 
            requirements = [], 
            benefits = "", 
            salary = "", 
            work_location = "", 
            contract_type = "", 
            start_date = "", 
            application_deadline = "", 
            selection_process = "", 
            diversity_policy = "", 
            required_documents = "" 
        } = req.body;

        // Obtendo companyId dos cookies
        const companyIdFromCookie = req.cookies.CompanyId;

        // Adicionando log para depuração
        console.log('Dados recebidos:', { 
            job_title, 
            job_description, 
            company_id, 
            companyIdFromCookie, 
            requirements, 
            benefits, 
            salary, 
            work_location, 
            contract_type, 
            start_date, 
            application_deadline, 
            selection_process, 
            diversity_policy, 
            required_documents 
        });

        // Verifica se o companyId está presente, preferindo o valor do corpo da requisição
        const companyId = company_id || companyIdFromCookie;

        // Verifica se os campos obrigatórios estão presentes
        if (!job_title || !job_description) {
            return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
        }

        if (!companyId) {
            return res.status(400).json({ error: 'companyId é obrigatório.' });
        }

        // Criar o objeto de vaga com todos os campos
        const newJob = {
            job_title,
            job_description,
            companyId,
            requirements: requirements.length ? requirements : undefined,  // Adiciona somente se houver requisitos
            benefits: benefits || undefined, // Não envia se vazio
            salary: salary || undefined, // Não envia se vazio
            work_location: work_location || undefined, // Não envia se vazio
            contract_type: contract_type || undefined, // Não envia se vazio
            start_date: start_date || undefined, // Não envia se vazio
            application_deadline: application_deadline || undefined, // Não envia se vazio
            selection_process: selection_process || undefined, // Não envia se vazio
            diversity_policy: diversity_policy || undefined, // Não envia se vazio
            required_documents: required_documents || undefined, // Não envia se vazio
        };

        // Inserir o objeto no banco de dados
        const result = await jobsCollection.insertOne(newJob);
        res.status(201).json({ message: 'Vaga criada com sucesso', jobId: result.insertedId });
    } catch (error) {
        console.error('Erro ao criar vaga:', error);
        res.status(500).json({ error: 'Erro ao criar vaga' });
    }
});

module.exports = router;
