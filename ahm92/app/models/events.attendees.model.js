const db = require('../../config/db');

exports.getOne = async function(id){
    console.log( `Request to get user ${id} from the attendees database...` );

    const conn = await db.getPool().getConnection();
    const query = 'select user_id AS attendeeId, first_name AS firstName, last_name AS lastName, date_of_interest AS dateOfInterest, name AS status from event_attendees ' +
        'join attendance_status on attendance_status_id = attendance_status.id' +
        ' join user on user.id = user_id and ' +
        'name="accepted" and event_id = ?' +
        'order by date_of_interest';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.create = async function(event_id, user_id, attendance_status, dateOfInterest) {
    console.log( `Request to insert user ${user_id} into the attendees database...` );

    const conn = await db.getPool().getConnection();
    const query = 'insert into event_attendees (event_id, user_id, attendance_status_id, date_of_interest) values ( ?, ?, ?, ?)';
    await conn.query( query, [ event_id, user_id, attendance_status, dateOfInterest ] );
    conn.release();
};

exports.delete = async function(event_id, id){
    console.log( `Request to delete user ${id} from the database...` );

    const conn = await db.getPool().getConnection();
    const query = 'delete from event_attendees where event_id = ? and user_id = ?';
    const [ rows ] = await conn.query( query, [ event_id, id ] );
    conn.release();
    return rows;
};

exports.check = async function(user_id, event_id) {
    console.log( `checking user already in event exists` );

    const conn = await db.getPool().getConnection();
    const query = 'select * from event_attendees where event_id = ? and user_id = ?';
    const [ rows ] = await conn.query( query, [ event_id, user_id ] );
    conn.release();
    return rows;
};

exports.authorize = async function(id, token) {
    console.log( 'authorizing event' );

    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ? and auth_token = ?';
    const [ rows ] = await conn.query( query, [ id, token ] );
    conn.release();
    return rows;
};
exports.checkEvent = async  function(event_id) {
    console.log( `check exists` );

    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [ rows ] = await conn.query( query, [ event_id ] );
    conn.release();
    return rows;
};

exports.findID = async  function(token) {
    console.log( `check exists` );

    const conn = await db.getPool().getConnection();
    const query = 'select * from user where auth_token = ?';
    const [ rows ] = await conn.query( query, [ token ] );
    conn.release();
    return rows;
};