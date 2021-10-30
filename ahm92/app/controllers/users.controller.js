const users = require('../models/users.model');
var passwordHash = require('password-hash');
var token = require('../middleware/tokenGenereate.js');
exports.create = async function(req, res){
    console.log( '\nRequest to create a new user...' );
    const email = req.body.email;
    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    var text = passwordHash.generate(req.body.password);

    try {

        if (email != null && (email.includes("@"))) {
            const result = await users.insert( email, first_name, last_name, text );
            if (result.length === 1 && result[0].password !== text) {
                res.status(400)
                    .send("bad request");
            } else {
                res.status(201)
                    .send({userId: result[0].id});
            }
        } else {
            res.status(400)
                .send("bad request");

        }

    } catch( err ) {
        res.status( 500 )
            .send( `ERROR creating user ${first_name}: ${ err }` );
    }
};

exports.getOne = async function(req, res) {
    console.log( '\nRequest to read a user...' );
    const id = req.params.id;
    try {
        const result = await users.getOne( id );
        if( result.length === 0 ){
            res.status( 404 )
                .send('Invalid Id Not Found');
        }
        else if(result.length === 1 && req.header("X-Authorization") !== result[0].auth_token){
            res.status( 200 )
                .send( {firstName: result[0].first_name, lastName: result[0].last_name} );
        } else {
            res.status( 200 )
                .json( {firstName: result[0].first_name, lastName: result[0].last_name, email: result[0].email} );
        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR reading user ${id}: ${ err }` );
    }
};

exports.login = async function(req, res) {
    console.log( '\nRequest to login a user...' );

    const email = req.body.email;
    const password1 = req.body.password;
    var token1 = await token.TokenGenerate();
    try {
        const result = await users.login(token1, email);
        if (result.length === 1) {
            if (passwordHash.verify(password1, result[0].password) === true) {
                res.statusMessage = "OK";
                res.status(200)
                    .send({userId: result[0].UserId, token: result[0].token});
            } else {
                res.statusMessage = "Bad Request";
                res.status(400)
                    .send("Bad Request");
            }
        } else {
            res.statusMessage = "Bad Request";
            res.status(400)
                .send("Bad Request");
        }

    } catch ( err) {
        res.statusMessage = "Internal Server Error";
        res.status(500)
            .send("Internal Server Error");
    }
};

exports.logout = async function(req, res) {
    console.log( '\nRequest to logout a user...' );

    const token = req.header("X-Authorization");
    try {
        const result = await users.logout(token);
        if (result.length !== 0) {
            res.statusMessage = "OK";
            res.status(200)
                .send();
        } else {
            res.statusMessage = "Bad Request";
            res.status(401)
                .send("Bad Request");
        }

    } catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(401)
            .send("Internal Server Error");
    }
};

exports.patch = async function(req, res) {
    console.log( '\nRequest to patch a user...');
    const id = req.params.id;
    const token = req.header("X-Authorization");
    var result = null;
    var checkUserExists = await users.exist(id);
    if (checkUserExists.length === 0) {
        res.statusMessage = "Bad Request";
        res.status(404)
            .send("Forbidden");
    } else {
        try {
            if (req.body.firstName !== undefined) {
                result = await users.updateFirstName(req.body.firstName, id, token);

            }
            if (req.body.lastName !== undefined) {
                result = await users.updateLastName(req.body.lastName, id, token);

            }
            if (req.body.email !== undefined) {
                result = await users.updateEmail(req.body.email, id, token);

            }
            if (req.body.password !== undefined && req.body.currentPassword !== undefined) {
                const newPass = passwordHash.generate(req.body.password);
                result = await users.updatePassword(newPass, id, token);
            }

            if(result.length === 0 && token !== null) {
                res.statusMessage = "Bad Request";
                res.status(403)
                    .send("Forbidden");
            }
            res.statusMessage = "OK";
            res.status(200)
                .send();
        } catch (err) {
            res.statusMessage = "Internal Server Error";
            res.status(500)
                .send("Internal Server Error");
        }

    }




};
// send final successful send at bottom of function