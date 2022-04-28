const { default: knex } = require('knex');

const listingAllTheCategories = async (req, res) => {
    try {
        const { rows } = await knex('categories');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listingAllTheCategories
};