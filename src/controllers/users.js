const conection = require('../database/knex');
const { errors } = require('../messages/error');
const { fieldsToUser, fieldsToLogin } = require('../validations/requiredFields');
const { tokenToGetID, tokenToGetEmail } = require('../validations/token');
const jwtSecret = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');
const securePassword = require('secure-password');
const { default: knex } = require('knex');
const pwd = securePassword()

const userFirstAccess = async (req, res) => {
    const { name, email, password } = req.body;
    const validations = fieldsToUser({ name, email, password });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    try {
        const getEmail = knex('users').select('email').where('email', email);
        const { rowCount: emailExists } = await conection.query(getEmail, [email]);
        if (emailExists > 0) {
            return res.status(400).json(errors.userExists);
        }

        const hash = (await pwd.hash(Buffer.from(password))).toString("hex");

        const addUser = knex('users').insert({ name, email, password: hash });
        const { rowCount: userCreated } = await conection.query(addUser, [name, email, hash]);

        if (userCreated === 0) {
            return res.status(400).json(errors.couldNotSignin);
        }

        const getUser = await knex('users').where('email', email); 
    
        const { rows } = await conection.query(getUser, [email]);
        const { 
            id: idSignIn,
            name: nameSignIn,
            email: emailSignIn
        } = rows[0];

        return res.status(200).json({ id: idSignIn,
            name: nameSignIn,
            email: emailSignIn
        });
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
        const { rowCount, rows } = await knex('users').where('email', email);

        if (rowCount === 0) {
            return res.status(400).json(errors.loginIncorrect);
        }
        const user = rows[0];

        const result = await pwd.verify(Buffer.from(password), Buffer.from(user.password, "hex"));
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json(errors.loginIncorrect);
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(password))).toString("hex");
                    await knex('users').where('email', email).update({ password: hash });
                } catch (error) {
                }
                break;
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, jwtSecret, {
            expiresIn: "730h"
        });

        return res.send({
            users: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
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

        const { rows } = await knex('users').where('email', email);
        const { id: _, ...dados } = rows[0];

        return res.status(200).json({ ...dados, password })
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


module.exports = {
    userFirstAccess,
    userLogIn,
    userUpdate,
    informationToTheUserHimself
};