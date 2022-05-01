const knex = require('../database/knex');

const { errors } = require('../messages/error');

const registerShopping = async (req, res) => {
    const userLogin = req.user;
    const { voucher_id } = req.body;

    if (voucher_id.length < 36) {
        return res.status(400).json({ mensagem: "Id do tipo UUID inválido" })
    }

    try {
        const getVoucher = await knex('voucher')
            .where({ id: voucher_id })
            .first();

        if (!getVoucher) {
            return res.status(404).json(errors.voucherNotFound);
        }

        const getScoreUser = await knex('users')
            .select('score')
            .where({ id: userLogin.id })
            .first();

        if (Number(getScoreUser.score) - Number(getVoucher.value) < 0) {
            return res.status(401).json({ mensagem: "Você não tem ponstos suficientes..." });
        }

        const buyVoucher = await knex('users')
            .where({ id: userLogin.id })
            .update({
                score: Number(getScoreUser.score) - Number(getVoucher.value)
            })

        if (!buyVoucher) {
            return res.status(400).json({ mensagem: "Não foi possível fazer a compra do cupom." });
        }

        const shopping = await knex('online_shopping')
            .insert({
                user_id: userLogin.id,
                voucher_id
            })

        if (!shopping) {
            return res.status(400).json({ mensagem: "Não foi possível realizar a compra." })
        }

        return res.status(201).json({ mensagem: "Compra realizada!" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getAllShopping = async (req, res) => {
    const userLogin = req.user;

    try {
        const getOnlineShopping = await knex('online_shopping')
            .select({ id: 'online_shopping.id', user_name: 'users.name', cpf: 'users.cpf', email: 'users.email', voucher: 'voucher.name', value: 'voucher.value' })
            .leftJoin('users', 'online_shopping.user_id', 'users.id')
            .leftJoin('voucher', 'online_shopping.voucher_id', 'voucher.id')
            .where({ user_id: userLogin.id })

        return res.status(200).json(getOnlineShopping);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteShopping = async (req, res) => {
    const userLogin = req.user;
    const { id_shopping } = req.params;

    if (id_shopping.length < 36) {
        return res.status(400).json({ mensagem: "Id do tipo UUID inválido" })
    }

    try {
        const getCurrentShopping = await knex('online_shopping')
            .where({ id: id_shopping })
            .first();

        if (!getCurrentShopping) {
            return res.status(404).json({ mensagem: "Compra não encontrada." });
        }

        const deleteCurrentShopping = await knex('online_shopping')
            .where({ id: id_shopping, user_id: userLogin.id })
            .del();

        if (!deleteCurrentShopping) {
            return res.status(400).json({ mensagem: "Não foi possível deletar a compra." });
        }

        return res.status(200).json({ mensagem: "Compra deletada com sucesso!" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    registerShopping,
    getAllShopping,
    deleteShopping
}
