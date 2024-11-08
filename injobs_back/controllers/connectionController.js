async function addConnection(req, res) {
    const { getConnectionCollection } = require('../models/connectionModel');
    const { getUserCollection } = require('../models/userModel');
    const { getCompanyCollection } = require('../models/companyModel');

    const { targetEmail } = req.body; 
    const loggedEmail = req.loginEmail; 

    if (!targetEmail) {
        return res.status(400).json({ error: 'Email do alvo é necessário' });
    }

    const connections = await getConnectionCollection();
    const users = await getUserCollection();
    const companies = await getCompanyCollection();

    try {
        const logged = await users.findOne({ email: loggedEmail }) || await companies.findOne({ email: loggedEmail });
        const target = await users.findOne({ email: targetEmail }) || await companies.findOne({ email: targetEmail });

        if (!logged || !target) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const loggedConnection = await connections.findOne({
            userId: logged.user_id || logged.company_id,
            connectedId: target.user_id || target.company_id
        });

        const targetConnection = await connections.findOne({
            userId: target.user_id || target.company_id,
            connectedId: logged.user_id || logged.company_id
        });

        if (loggedConnection && targetConnection) {
            if (loggedConnection.status === 'pending' && targetConnection.status === 'pending') {
                await connections.updateOne({ _id: loggedConnection._id }, { $set: { status: 'confirmed' } });
                await connections.updateOne({ _id: targetConnection._id }, { $set: { status: 'confirmed' } });

                return res.status(200).json({ message: 'Conexão confirmada com sucesso' });
            }
            return res.status(409).json({ error: 'Conexão já existe' });
        }

        if (!loggedConnection) {
            await connections.insertOne({
                userId: logged.user_id || logged.company_id,
                connectedId: target.user_id || target.company_id,
                status: 'pending'
            });
        }

        if (!targetConnection) {
            await connections.insertOne({
                userId: target.user_id || target.company_id,
                connectedId: logged.user_id || logged.company_id,
                status: 'pending'
            });
        }

        return res.status(201).json({ message: 'Solicitação de conexão enviada com sucesso' });

    } catch (error) {
        console.error('Erro ao criar conexão:', error);
        res.status(500).json({ error: 'Erro ao criar conexão' });
    }
}

module.exports = { addConnection }
