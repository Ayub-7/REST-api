const events = require('../controllers/events.attendees.controller');
var authorize = require('../middleware/authenticateAttendees.js');

module.exports = function (app) {
    app.route(app.rootUrl + '/events/:id/attendees')
        .get(events.getOne)
        .post(authorize.Authenticate, events.create);

    app.route(app.rootUrl + '/events/:id/attendees')
        .delete(authorize.Authenticate, events.delete);

};