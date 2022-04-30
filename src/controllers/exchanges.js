const knex = require("../database/knex");
const { fieldsToExchange } = require("../validations/requiredFields");

const doAexchange = async (req, res) => {
    const userLogin = req.user;
    const { category_id, collect_point_id, amount } = req.body;

    const validations = fieldsToExchange({ category_id, collect_point_id, amount });

    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const getScore = await knex('categories').select('score').where({ id: category_id }).first();

        if (!getScore) {
            return res.status(404).json(errors.categoryNotFound);
        }

        const doExchange = await knex('exchange').insert({
            category_id,
            collect_point_id,
            amount,
            score: (Number(getScore.score) * Number(amount)),
            user_id: userLogin.id,
        });

        if (!doExchange) {
            return res.status(400).json(errors.couldNotExchange);
        }

        const updateScore = await knex('users').where({ id: userLogin.id }).update({
            score: (Number(getScore.score) * Number(amount)) + Number(userLogin.score),
        });

        if (!updateScore) {
            return res.status(400).json(errors.couldNotUpdateScore);
        }

        return res.status(201).json({ "mensagem": "Parabéns! Você fez um descarte consciente!" });
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

const showExchange = async (req, res) => {
    const userLogin = req.user;

    try {
        const getExchange = await knex.select({ id: 'exchange.id', user_name: 'users.name', category_name: 'categories.name', amount: 'exchange.amount', collection_location: 'collect_point.name', collection_address: 'collect_point.address', score: 'exchange.score' })
            .from('exchange')
            .leftJoin('users', 'exchange.user_id', 'users.id')
            .leftJoin('categories', 'exchange.category_id', 'categories.id')
            .leftJoin('collect_point', 'exchange.collect_point_id', 'collect_point.id')
            .where({ user_id: userLogin.id });

        if (!getExchange) {
            return res.status(404).json(errors.exchangeNotFound);
        }
        return res.status(200).json(getExchange);
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

module.exports = {
    doAexchange,
    showExchange
}