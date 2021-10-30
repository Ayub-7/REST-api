const events = require('../controllers/events.controller');
var authorize = require('../middleware/authenticate.event.js');

module.exports = function (app) {
    app.route(app.rootUrl + '/events')
        .get(events.getEvents);
    app.route(app.rootUrl + '/events/:id/image')
        .put(authorize.authenticateEvent, events.putImage)
        .get(events.getImage);
};