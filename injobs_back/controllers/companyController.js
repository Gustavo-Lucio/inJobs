const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { getCompanyCollection } = require('../models/companyModel');
const jwt = require('jsonwebtoken');

async function signupCompany(req, res) {
    const { email, password } = req.body;
    const generatedCompanyId = uuidv4();
    const sanitizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const companies = await getCompanyCollection();

    const existingCompany = await companies.findOne({ email: sanitizedEmail });
    if (existingCompany) return res.status(409).send('E-mail já cadastrado');

    const data = {
        company_id: generatedCompanyId,
        email: sanitizedEmail,
        hashed_password: hashedPassword
    };

    const insertedCompany = await companies.insertOne(data);

    // Definindo a chave secreta diretamente para o teste
    const secretKey = 'your_secret_key_here'; // Substitua por uma chave qualquer
    const token = jwt.sign({ company_id: generatedCompanyId }, secretKey, {
        expiresIn: '1d', // 1 dia de expiração
    });

    return res.status(201).json({ token, companyId: generatedCompanyId });
}

async function loginCompany(req, res) {
    const { email, password } = req.body;
    const companies = await getCompanyCollection();

    const company = await companies.findOne({ email: email.toLowerCase() });
    if (!company) return res.status(400).send('Credenciais inválidas');

    const correctPassword = await bcrypt.compare(password, company.hashed_password);
    if (correctPassword) {
        const secretKey = 'your_secret_key_here'; // Substitua por uma chave qualquer
        const token = jwt.sign({ company_id: company.company_id }, secretKey, {
            expiresIn: '1d', // 1 dia de expiração
        });
        return res.status(201).json({ token, companyId: company.company_id });
    }
    
    return res.status(400).send('Credenciais inválidas');
}

async function getCompany(req, res) {
    const companies = await getCompanyCollection();
    const companyId = req.params.companyId; // Obtém o companyId da URL

    const company = await companies.findOne({ company_id: companyId }); // Busca a empresa pelo ID

    if (!company) {
        return res.status(404).send('Empresa não encontrada');
    }

    const { hashed_password, ...companyData } = company; // Remove a senha dos dados retornados
    res.json(companyData); // Retorna os dados da empresa
}

async function createVacancy(req, res) {
    // Extrair o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho Authorization
    if (!token) return res.status(403).send('Token de autenticação não fornecido');

    const secretKey = 'your_secret_key_here'; // Substitua por uma chave qualquer
    try {
        // Decodifica o token e extrai o company_id
        const decoded = jwt.verify(token, secretKey);
        const companyId = decoded.company_id;

        const companies = await getCompanyCollection();
        const formData = req.body.formData;

        const newVacancy = formData.vaga;
        newVacancy.company_id = companyId;  // Garanta que o company_id seja atribuído à vaga

        const query = { company_id: companyId };

        const updateDocument = {
            $push: {
                vagas: newVacancy
            }
        };

        const result = await companies.updateOne(query, updateDocument);
        if (result.modifiedCount === 0) {
            return res.status(404).send('Empresa não encontrada');
        }
        res.status(201).json({ message: 'Vaga criada com sucesso', jobId: newVacancy._id });
    } catch (error) {
        console.error('Erro ao criar a vaga:', error);
        res.status(500).send('Erro ao criar a vaga');
    }
}

async function putCompany(req, res) {
    console.log(req.body); // Verifique o conteúdo

    const companies = await getCompanyCollection();
    const { company_id, ...updatedData } = req.body; // Extraímos company_id e o resto dos dados

    // Remover o campo '_id' de updatedData, se presente
    if (updatedData._id) {
        delete updatedData._id;
    }

    const query = { company_id };
    const updateDocument = {
        $set: {
            ...updatedData,
            email: req.cookies.Email || updatedData.email // Mantém a lógica do email
        }
    };

    try {
        const result = await companies.updateOne(query, updateDocument);
        if (result.matchedCount === 0) {
            return res.status(404).send('Empresa não encontrada');
        }
        res.send(result);
    } catch (error) {
        console.error('Erro ao atualizar a empresa:', error);
        res.status(500).send('Erro interno do servidor');
    }
}

module.exports = { signupCompany, loginCompany, getCompany, createVacancy, putCompany };
