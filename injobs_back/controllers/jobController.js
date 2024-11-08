const { getJobCollection } = require('../models/Job');

async function createJob(req, res) {
    const { 
        job_title, 
        job_description, 
        company_id, 
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
    } = req.body; // Recebendo todos os campos do corpo da requisição

    const companyIdFromCookie = req.cookies.CompanyId;

    // Adicionando log para depuração
    console.log('Dados recebidos:', req.body);

    try {
        // Verifica se o companyId está presente, preferindo o valor do corpo da requisição
        const companyId = company_id || companyIdFromCookie;

        if (!job_title || !job_description || !companyId) {
            return res.status(400).json({ message: 'Título, descrição e companyId são obrigatórios.' });
        }

        // Cria o objeto de vaga
        const job = {
            job_title,
            job_description,
            companyId,
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
        };

        const jobsCollection = await getJobCollection();
        const result = await jobsCollection.insertOne(job);

        res.status(201).json({ message: 'Vaga criada com sucesso', jobId: result.insertedId });
    } catch (error) {
        console.error('Erro ao criar vaga:', error); 
        res.status(500).json({ message: error.message });
    }
}

async function getJobs(req, res) {
    try {
        const jobsCollection = await getJobCollection();
        const jobs = await jobsCollection.find({}).toArray();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Erro ao buscar vagas:', error); // Log para depuração
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createJob,
    getJobs,
};
