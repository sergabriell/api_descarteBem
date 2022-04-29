const knex = require('../database/knex');

const listingAllTheVouchers = async (req, res) => {
    try {
        const voucher = await knex('voucher');
        return res.status(200).json(voucher);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listingAllTheVouchers
}