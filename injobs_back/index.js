const PORT = 8000;
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Importação da rota de vagas
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3000', // Permitir apenas requisições desse domínio
    credentials: true // Permitir cookies
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json('Bem-vindo ao app');
});

// Definindo as rotas
app.use('/user', userRoutes);
app.use('/company', companyRoutes);
app.use('/jobs', jobRoutes); // Adicionando as rotas de vagas

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Middleware para verificar se o companyId está presente nos cookies
app.use((req, res, next) => {
    const companyId = req.cookies.CompanyId;
    if (req.method === 'POST' && req.path === '/jobs') {
        if (!companyId) {
            return res.status(400).send('CompanyId é obrigatório');
        }
        req.body.companyId = companyId; // Adicionando companyId ao corpo da requisição
    }
    next();
});

app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
