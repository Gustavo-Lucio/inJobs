const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { getUserCollection } = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function signupUser(req, res) {
    const { email, password } = req.body;
    const generatedUserId = uuidv4();
    const sanitizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await getUserCollection();

    const existingUser = await users.findOne({ email: sanitizedEmail });
    if (existingUser) return res.status(409).send('E-mail já cadastrado');

    const data = {
        user_id: generatedUserId,
        email: sanitizedEmail,
        hashed_password: hashedPassword
    };

    await users.insertOne(data);

    const token = jwt.sign({ user_id: generatedUserId }, sanitizedEmail, {
        expiresIn: 60 * 24,
    });

    return res.status(201).json({ token, userId: generatedUserId });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const users = await getUserCollection();

    const user = await users.findOne({ email });
    if (!user) return res.status(400).send('Credenciais inválidas');

    const correctPassword = await bcrypt.compare(password, user.hashed_password);
    if (correctPassword) {
        const token = jwt.sign({ user_id: user.user_id }, email, {
            expiresIn: 60 * 24,
        });
        return res.status(200).json({ token, userId: user.user_id });
    }
    return res.status(400).send('Credenciais inválidas');
}

async function getUser(req, res) {
    const users = await getUserCollection();
    const userId = req.params.userId;

    const user = await users.findOne({ user_id: userId });
    if (!user) {
        return res.status(404).send('Usuário não encontrado');
    }

    const { hashed_password, ...userData } = user;
    res.json(userData);
}

async function getAllUsers(req, res) {
    const users = await getUserCollection();
    
    try {
        const allUsers = await users.find().toArray(); // Obtém todos os usuários
        res.json(allUsers); // Retorna todos os usuários
    } catch (error) {
        res.status(500).send('Erro ao obter usuários');
    }
}

async function putUser(req, res) {
    const users = await getUserCollection();
    const formData = req.body.formData;

    const query = { user_id: formData.user_id };
    const habilidades = formData.habilidades || [];
    const updateDocument = {
        $set: {
            nome_candidato: formData.nome_candidato,
            cpf_candidato: formData.cpf_candidato,
            endereco_candidato: formData.endereco_candidato,
            n_candidato: formData.n_candidato,
            cidade_candidato: formData.cidade_candidato,
            estado_candidato: formData.estado_candidato,
            pais_candidato: formData.pais_candidato,
            dob_day: formData.dob_day,
            dob_month: formData.dob_month,
            dob_year: formData.dob_year,
            gender_identity: formData.gender_identity,
            telefone_candidato: formData.telefone_candidato,
            about_candidato: formData.about_candidato,
            linkedin_candidato: formData.linkedin_candidato,
            links_candidato: formData.links_candidato,
            nivel_escolaridade_candidato: formData.nivel_escolaridade_candidato,
            curso_candidato: formData.curso_candidato,
            instituicao_candidato: formData.instituicao_candidato,
            mes_inicio: formData.mes_inicio,
            ano_inicio: formData.ano_inicio,
            mes_termino: formData.mes_termino,
            ano_termino: formData.ano_termino,
            estado_estudo: formData.estado_estudo,
            habilidades: habilidades,
            url: formData.url,
            about: formData.about,
            matches: formData.matches
        },
    };
    
    const result = await users.updateOne(query, updateDocument);
    if (result.modifiedCount === 0) {
        return res.status(404).send('Usuário não encontrado ou nenhum dado foi alterado.');
    }

    res.send('Usuário atualizado com sucesso.');
}

module.exports = { signupUser, loginUser, getUser, getAllUsers, putUser };
