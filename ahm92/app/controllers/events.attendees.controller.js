const attendees = require('../models/events.attendees.model');
const dateCheck = require('../middleware/dateCheck.js');
const db = require('../../config/db');


exports.getOne = async function(req, res) {
    console.log( '\nRequest to read an events attendees...' );

    const id = req.params.id;
    try {
        const result = await attendees.getOne( id );
        if( result.length === 0 ){
            res.status( 404 )
                .send('Invalid Id Not Found');
        }
        else {
            res.status( 200 )
                .send( result );
        }     } catch( err ) {
        res.status( 500 )
            .send( `ERROR reading user ${id}: ${ err }` );
    }
};

exports.create = async function (req, res) {
    console.log( '\nRequest to insert an event attendee...' );

    const event_id = req.params.id;
    const attendance_status = 2;
    const token = req.header("X-Authorization");
    const findId = await attendees.findID(token);
    const user_id = findId[0].id;
    try {

        const checkEventExists = await attendees.checkEvent(event_id);
        const checkInEvent = await attendees.check(user_id, event_id);
         if (checkInEvent.length !== 0) {
            res.status(403)
                .send("forbidden");
        } else if (checkEventExists.length === 0) {
            res.status(404)
                .send("not found");
        }
        else {
            const dateOfInterest = checkEventExists[0].date;
            var today = new Date();
            var myDate = new Date(dateOfInterest);
            var ans = await dateCheck.dateCheck(myDate, today);
            if (((ans) === false)) {
                await attendees.create( event_id, user_id, attendance_status, dateOfInterest);
                res.status( 201 )
                    .send();
                //We return the user_id to the client to use in further requests
            } else {
                res.status(400)
                    .send("bad request");

            }
        }


    } catch( err ) {
        res.status( 500 )
            .send( `ERROR creating user : ${ err }` );
    }
};

exports.delete = async function(req, res){
    console.log( '\nRequest to delete a attendee...' );

    const event_id = req.params.id;
    const token = req.header("X-Authorization");
    const findId = await attendees.findID(token);
    const user_id = findId[0].id;
    try {
        const checkInEvent = await attendees.check(user_id, event_id);
        if (checkInEvent.length === 0) {
            res.status(403)
                .send("forbidden");
        } else {
            const result = await attendees.delete( event_id, user_id );
            if( result.length === 0 ){
                res.status( 400 )
                    .send('Invalid Id');
            }
            else {
                res.status( 200 )
                    .send( result );
            }
        }

    } catch( err ) {
        res.status( 500 )
            .send( `ERROR reading user ${id}: ${ err }` );
    }
};