const env = require('dotenv');
const jwt = require('jsonwebtoken');

const knex = require('../database/knex');
const { errors } = require('../messages/error');

env.config()

const jwtSecret = process.env.JWT_SECRET;

const authorizationToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || authorization === 'Bearer undefined') {
        return res.status(401).json({ mensagem: "O usuário precisa estar logado!" });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        if (!token) {
            return res.status(400).json(errors.accountX);
        }

        const { id: jwtID } = await jwt.verify(token, jwtSecret);

        const getUser = await knex('users').where({ id: jwtID }).first();
        if (!getUser) {
            return res.status(404).json(errors.tokenX);
        }

        req.user = getUser;

        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: "Logue e forneça um token válido para ter acesso!" })
        }
        return res.status(400).json(error.message);
    }
}

module.exports = { authorizationToken };