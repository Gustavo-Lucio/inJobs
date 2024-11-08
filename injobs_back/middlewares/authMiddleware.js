const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ChaveSecretaSuperSegura123';

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acesso negado' });

    jwt.verify(token, JWT_SECRET, (err, logado) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.loginEmail = logado.email; 
        next();
    });
}

module.exports = authenticateToken;
