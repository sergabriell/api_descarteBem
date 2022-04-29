const knex = require("../database/knex");

const listingAllTheCategories = async (req, res) => {
    try {
        const categories = await knex('categories');
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listingAllTheCategories
};