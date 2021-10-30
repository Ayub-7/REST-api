const users = require('../models/users.images.model');
const fs1 = require('mz/fs');
const path = require("path");
const fs = require('fs');

exports.getImage = async function (req, res) {
    console.log( '\nRequest to get a users image...' );
    const id = req.params.id;
    try {
        const result = await users.getImage( id );
        if( result[0].image_filename === null ){
            res.statusMessage = 'Not Found';
            res.status( 404 )
                .send('not found ');
        }
        const imageName = result[0].image_filename;
        const exIndex = imageName.indexOf('.');
        const imageExtension = imageName.slice(exIndex+1);
        res.setHeader('content-type', 'image/' + imageExtension);

        if ( fs1.exists('./storage/images/' +  result[0].image_filename)) {
            res.statusMessage = 'OK';
            res.status( 200 )
                .sendfile(result[0].image_filename, {root: './storage/images/'});
        }


    } catch( err ) {
        res.statusMessage = 'Internal Server Error';
        res.status( 500 )
            .send( `ERROR reading image of user ${id}: ${ err }` );
    }
};

exports.putImage = async function (req, res) {
    console.log( '\nRequest to put a users image...' );
    const id = req.params.id;
    const image = req.body;
    const token = req.header('X-Authorization');
    const type = req.header('Content-Type');
    var n = type.indexOf('/');
    const imageExtension = type.slice(n+1);
    var imagePath = 'User_' + id + '.' + imageExtension;
    const checkAnotherUser = await users.check(id);
    if (checkAnotherUser[0].auth_token !== token) {
        res.statusMessage = 'Forbidden';
        res.status( 403 )
            .send();
    } else {
        const result = await users.putImage(imagePath, id);
        const imageString = checkAnotherUser[0].image_filename;
        if (imageString === null) {
            fs.appendFileSync('./storage/images/' + imagePath, image);
            res.statusMessage = 'Created';
            res.status( 201 )
                .send();
        } else {
            fs.appendFileSync('./storage/images/' + imagePath, image);
            res.statusMessage = 'OK';
            res.status( 200 )
                .send();
        }
    }
};

exports.delete = async function (req, res) {
    console.log( '\nRequest to delete a users image...' );

    const id = req.params.id;
    const token = req.header('X-Authorization');
    const deleteImage = await users.deleteImage(id);

    if (deleteImage.length === 0){
        res.statusMessage = 'Not Found';
        res.status( 404 )
            .send('not found ');
    } else if (deleteImage[0].auth_token !== token) {
        res.statusMessage = 'Forbidden';
        res.status( 403 )
            .send();
    } else {
        res.statusMessage = 'OK';
        res.status( 200 )
            .send();
    }
};
