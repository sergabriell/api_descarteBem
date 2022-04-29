const { errors } = require('../messages/error')

const fieldsToUser = ({ name, email, cpf, password }) => {
    if (!name) {
        const response = {
            message: errors.nameX,
            ok: false
        }
        return response;
    }

    if (!email) {
        const response = {
            message: errors.emailX,
            ok: false
        }
        return response;
    }

    if (!cpf) {
        const response = {
            message: errors.cpfX,
            ok: false
        }
        return response;
    }

    if (!password) {
        const response = {
            message: errors.passwordX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

const fieldsToLogin = ({ email, password }) => {
    if (!email) {
        const response = {
            message: errors.emailX,
            ok: false
        }
        return response;
    }

    if (!password) {
        const response = {
            message: errors.passwordX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}

const fieldsToExchange = ({ category_id, id_collect_point, score }) => {
    if (!category_id) {
        const response = {
            message: errors.categoryX,
            ok: false
        }
        return response;
    }

    if (!id_collect_point) {
        const response = {
            message: errors.collectPointX,
            ok: false
        }
        return response;
    }

    if (!score) {
        const response = {
            message: errors.scoreX,
            ok: false
        }
        return response;
    }

    return { ok: true }
}


module.exports = {
    fieldsToUser,
    fieldsToLogin,
    fieldsToExchange
}