const express = require('express');
const { signupUser, loginUser, getUser, getAllUsers, putUser } = require('../controllers/userController');
const { addConnection } = require('../controllers/connectionController')
const authenticateToken = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/', getAllUsers); // Rota para obter todos os usuários
router.get('/users/:userId', getUser); // Rota para obter dados de um usuário específico
router.put('/putUser', putUser);
router.post('/connect', authenticateToken, addConnection)

module.exports = router;
