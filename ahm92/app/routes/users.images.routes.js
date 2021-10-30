const users = require('../controllers/users.images.controller');
var authorize = require('../middleware/authenticate.js');

module.exports = function (app) {

    app.route(app.rootUrl + '/users/:id/image')
        .get(users.getImage)
        .put(authorize.Authenticate, users.putImage)
        .delete(authorize.Authenticate, users.delete);
};