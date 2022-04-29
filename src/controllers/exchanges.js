const { default: knex } = require("knex");

const doAexchange = async (req, res) => {
    const userLogin = req.user;
    const { category_id, collect_point_id, amount } = req.body;

    const validations = fieldsToExchange({ category_id, collect_point_id, score });

    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const doExchange = await knex('exchanges').insert({
            category_id,
            collect_point_id,
            amount,
            user_id: userLogin.id,
        });

        if (!doExchange) {
            return res.status(400).json(errors.couldNotExchange);
        }

        const getScore = await knex('categories').select('score').where({ id: category_id }).first();

        if (!getScore) {
            return res.status(404).json(errors.categoryNotFound);
        }

        const updateScore = await knex('users').where({ id: userLogin.id }).update({
            score: getScore.score * amount,
        });

        if(!updateScore) {
            return res.status(400).json(errors.couldNotUpdateScore);
        }

        return res.status(201).json({ "mensagem": "Parabéns! Você fez um descarte consciente!"});
    } catch (error) {
        return res.status(400).json(error.message);
    }
    
}

module.exports = {
    doAexchange
}