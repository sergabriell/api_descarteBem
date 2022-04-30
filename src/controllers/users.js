const env = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const knex = require('../database/knex');

const { errors } = require('../messages/error');
const { tokenToGetID, tokenToGetEmail } = require('../validations/token');
const { fieldsToUser, fieldsToLogin } = require('../validations/requiredFields');

env.config()
const jwtSecret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    const { name, email, cpf, password, address } = req.body;
    const validations = fieldsToUser({ name, email, cpf, password, address });

    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const getEmail = await knex('users').where({ email }).first();

        if (getEmail) {
            return res.status(400).json(errors.userExists);
        }

        const SALT = 10;
        const hash = await bcrypt.hash(password, SALT);

        const addUser = await knex('users').insert({ name, email, cpf, password: hash, address });

        if (!addUser) {
            return res.status(400).json(errors.couldNotSignin);
        }

        return res.status(201).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userLogIn = async (req, res) => {
    const { email, password } = req.body;
    const validations = fieldsToLogin({ email, password });

    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const getUser = await knex('users').where({ email }).first();

        if (!getUser) {
            return res.status(400).json(errors.loginIncorrect);
        }

        const correctPassword = await bcrypt.compare(password, getUser.password);
        if (!correctPassword) {
            return res.status(400).json(errors.loginIncorrect);
        }

        const token = jwt.sign({
            id: getUser.id
        }, jwtSecret, {
            expiresIn: "800h"
        });

        return res.json({
            user: {
                id: getUser.id,
                name: getUser.name,
                email: getUser.email,
                address: getUser.address
            },
            token
        });
    } catch (error) {
        return res.status(500).json(error.message);
    };

};

const informationToTheUserHimself = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    try {
        const { rowCount, rows } = await knex('users').where('id', jwtID);
        if (rowCount === 0) {
            return res.status(404).json(errors.userNotFound);
        }

        const { password: _, ...outrosDados } = rows[0];
        return res.status(201).json({
            ...outrosDados,
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userUpdate = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const jwtEmail = tokenToGetEmail({ req })

    const { name, email, password } = req.body;
    const validations = fieldsToUser({ name, email, password });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    try {
        const { rowCount: ifEmailExists } = await knex('users').where('email', email);

        if (ifEmailExists !== jwtEmail) {
            return res.status(404).json("O e-mail informado já está sendo utilizado por outro usuário.");
        }

        const hash = (await pwd.hash(Buffer.from(password))).toString("hex");

        const { rowCount: userUpdated } = await knex('users').where('id', jwtID).update({ name, email, password: hash });

        if (userUpdated === 0) {
            return res.status(400).json('Não foi possivel atualizar o usuário.');
        }

        const user = await knex('users').where('email', email).first();
        const { id: _, ...dados } = user;

        return res.status(200).json({ ...dados, password })
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


module.exports = {
    registerUser,
    userLogIn,
    userUpdate,
    informationToTheUserHimself
};