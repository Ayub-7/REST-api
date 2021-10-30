const users = require('../models/users.model');

exports.Authenticate = async function (req, res, next) {
    const token = req.header('X-Authorization');

    try {
        const result = await users.findUserByToken(token);
        if (result.length === 0) {
            res.statusMessage = 'Unauthorized';
            res.status(401)
                .send();
        } else {
            next();
        }

    } catch (err) {
        res.statusMessage = 'internal server error';
        res.status(500)
            .send();
    }
}