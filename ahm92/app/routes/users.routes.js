const users = require('../controllers/users.controller');
var authorize = require('../middleware/authenticate.js');

module.exports = function (app) {

    app.route(app.rootUrl + '/users/register')
        .post(users.create);

    app.route(app.rootUrl + '/users/:id')
        .get(users.getOne)
        .patch(authorize.Authenticate, users.patch);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(users.logout);
};