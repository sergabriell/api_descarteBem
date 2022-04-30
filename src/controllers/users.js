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
    const userLogin = req.user;

    try {
        const user = await knex('users').select('id', 'name', 'cpf', 'email', 'address', 'score').where({ id: userLogin.id }).first();

        if (!user) {
            return res.status(404).json(errors.userNotFound);
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userUpdate = async (req, res) => {
    const userLogin = req.user;
    const { name, cpf, email, password, address } = req.body;

    try {
        const user = await knex('users').select('id', 'name', 'cpf', 'email', 'address', 'score').where({ id: userLogin.id }).first();

        if (!user) {
            return res.status(404).json(errors.userNotFound);
        }

        const getEmail = await knex('users').where({ email }).whereNot({ email: user.email }).first();

        if (getEmail) {
            return res.status(400).json(errors.userExists);
        }

        const SALT = 10;
        const hash = await bcrypt.hash(password, SALT);

        const updatedUser = await knex('users').update({ name, cpf, email, password: hash, address }).where({ id: userLogin.id });

        if (!updatedUser) {
            return res.status(400).json(errors.userUpdate);
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


module.exports = {
    registerUser,
    userLogIn,
    informationToTheUserHimself,
    userUpdate
};