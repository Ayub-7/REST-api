const events = require('../models/events.model');
const fs = require('fs');
const fs1 = require('mz/fs');


exports.getEvents = async function(req, res){
    console.log( '\nRequest to list events...' );
    try {
        const startIndex = req.query.startIndex;
        const count = req.query.count;
        const q = req.query.q;
        const categoryIds = req.query.categoryIds;
        const organizerId = req.query.organizerId;
        const sortBy = req.query.sortBy;
        const result = await events.getEvents(startIndex, count, q, categoryIds, organizerId, sortBy);
        if (startIndex===undefined && count===undefined && q===undefined && categoryIds===undefined && organizerId===undefined && sortBy === undefined) {
            for (var i = 0; i < result.length; i++) {
                result[i].categories = result[i].categories.split(',');
            }
            for (var j = 0; j < result.length; j++) {
                for (var i = 0; i < result[j].categories.length; i++) {
                    result[j].categories[i] = parseInt(result[j].categories[i]);
                }
            }
            res.status( 200 )
                .send( result );
        } else {
            if (categoryIds !== undefined) {
                for (var i = 0; i < categoryIds.length; i++) {
                    categoryIds[i] = parseInt(categoryIds[i]);
                }
            }
            for (var i = 0; i < result.length; i++) {
                result[i].categories = result[i].categories.split(',');
            }
            for (var j = 0; j < result.length; j++) {
                for (var i = 0; i < result[j].categories.length; i++) {
                    result[j].categories[i] = parseInt(result[j].categories[i]);
                }
            }
            var newArr = []
            if (categoryIds !== undefined) {
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < categoryIds.length; j++) {
                        if ((result[i].categories).includes(categoryIds[j])) {
                            newArr.push(result[i]);
                        }
                    }
                }
                if (categoryIds > 33) {
                    res.status( 400 )
                        .send() ;
                } else {
                    res.status( 200 )
                        .send( newArr );
                }
            } else {
                res.status( 200 )
                    .send( result );
            }

        }





    } catch( err ) {
        console.log(err);
        res.status( 500 )
            .send( `ERROR getting events ${ err }` );
    }
};

exports.putImage = async function (req, res) {
    console.log( '\nRequest to put events image...' );
    const id = req.params.id;
    const image = req.body;
    const type = req.header('Content-Type');
    var n = type.indexOf('/');
    const imageExtension = type.slice(n+1);
    var imagePath = 'Event_' + id + '.' + imageExtension;
    const check = await events.check2(id);
    const checkEventExists = await events.checkEventsExist(id);
    var extensions = ['png', 'jpeg', 'jpg', 'gif']
    if (extensions.includes(imageExtension)) {
        if (checkEventExists.length === 0) {
            res.statusMessage = 'Forbidden';
            res.status( 404 )
                .send();
        } else {
            await events.putImage(imagePath, id);
            const imageString = check[0].image_filename;
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
    } else {

        res.statusMessage = 'Bad Request';

        res.status(400)
            .send();
    }
};

exports.getImage = async function (req, res) {
    console.log( '\nRequest to get an events image...' );
    const id = req.params.id;
    try {
        const result = await events.getImage( id );
        if( result.length === 0 ){
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
