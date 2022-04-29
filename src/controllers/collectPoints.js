const knex = require('../database/knex');

const listingAllTheCollectPoints = async (req, res) => {
    try {
        const collectPoints = await knex('collect_point');
        return res.status(200).json(collectPoints);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listingAllTheCollectPoints
}