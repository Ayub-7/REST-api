const events = require('../models/events.model');

exports.authenticateEvent = async function (req, res, next) {
    console.log('authenticating....');
    const token = req.header('X-Authorization');

    try {
        const result = await events.findOrganizerByToken(token);
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
};