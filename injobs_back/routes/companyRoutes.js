const express = require('express');
const {
    signupCompany,
    loginCompany,
    getCompany,
    createVacancy,
    putCompany
} = require('../controllers/companyController');
const { addConnection } = require('../controllers/connectionController')
const authenticateToken = require('../middlewares/authMiddleware')

const router = express.Router();

// Rotas para a empresa
router.post('/signup', signupCompany); // Cadastra uma nova empresa
router.post('/login', loginCompany); // Realiza o login de uma empresa
router.get('/companies', getCompany); // Obtém todas as empresas
router.get('/companies/:companyId', getCompany); // Obtém uma empresa específica pelo ID
router.post('/vacancy', createVacancy); // Cria uma nova vaga
router.put('/putCompany', putCompany); // Atualiza os dados de uma empresa
router.post('/connect', authenticateToken, addConnection)


module.exports = router;
