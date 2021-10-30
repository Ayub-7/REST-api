const db = require('../../config/db');

exports.getEvents = async function(startIndex, count, q, categoryIds, organizerId, sortBy){
    console.log( 'Request to get all events from the database...' );
    const conn = await db.getPool().getConnection();
    if ((startIndex===undefined && count===undefined && q===undefined && categoryIds===undefined && organizerId===undefined && sortBy === undefined)) {
        const query = 'SELECT event.id AS eventId, event.title, group_concat(distinct event_category.category_id) AS categories, user.first_name AS organizerFirstName,' +
            ' user.last_name AS organizerLastName, (select count(*) from event_attendees where event_attendees.event_id = event.id and attendance_status_id = 1) AS numAcceptedAttendees, capacity FROM event, user, event_attendees, event_category ' +
            'where user.id = event.organizer_id ' +
            'and event_attendees.event_id = event.id and ' +
            'event_category.event_id = event_attendees.event_id ' +
            'group by event.id ' +
            'order by event.date';
        const [ rows ] = await conn.query( query);
        conn.release();
        return rows;
    } else {
        var query = 'SELECT event.id AS eventId, event.title, group_concat(distinct event_category.category_id) AS categories, user.first_name AS organizerFirstName,'  +
            ' user.last_name AS organizerLastName, (select count(*) from event_attendees where event_attendees.event_id = event.id and attendance_status_id = 1) AS numAcceptedAttendees, capacity ' +
            'FROM event JOIN user ON user.id = event.organizer_id ' +
            'JOIN event_attendees ON event_attendees.event_id = event.id ' +
            'JOIN event_category ON  event_category.event_id = event_attendees.event_id where event.id ';
        if(categoryIds !== undefined) {
            for (var i = 0; i < categoryIds.length; i++) {
                query += ` OR event_category.category_id = ${Number(categoryIds[i])} `;
            }
        }
        if (q !== undefined){
            query += 'AND';
            query += ` title like '%${q}%' or description like '%${q}%' `;
        }

        if (organizerId !== undefined) {
            query += 'AND';
            query += ` organizer_id = ${organizerId} `

        }
        if (sortBy === undefined) {
            query += ' group by event.id';
        }
        if (sortBy !== undefined) {
            query += 'group by event.id';
            if (sortBy === 'ALPHABETICAL_ASC') {
                query += ` ORDER by title ASC`;
            }
            else if (sortBy === 'ALPHABETICAL_DESC') {
                query += ` ORDER by title DESC`;

            }
            else if (sortBy === 'DATE_ASC') {
                query += ` ORDER by date ASC`;
            }
            else if (sortBy === 'DATE_DESC') {
                query += ` ORDER by date DESC`;
            }
            else if (sortBy === 'ATTENDEES_ASC') {
                query += ` ORDER by numAcceptedAttendees ASC`;
            }
            else if (sortBy === 'ATTENDEES_DESC') {
                query += ` ORDER by numAcceptedAttendees DESC`;
            }
            else if (sortBy === 'CAPACITY_ASC') {
                query += ` ORDER by capacity ASC`;
            }
            else if (sortBy === 'CAPACITY_DESC') {
                query += ` ORDER by capacity DESC`;
            }

        }

        if (count !== undefined) {
            query += ` LIMIT ${count} `;
        }
        if (startIndex !== undefined) {
            if (count === undefined) {
                query += ` LIMIT 500 OFFSET ${startIndex}`
            } else {
                query += ` OFFSET ${startIndex}`;
            }
        }
        const [ rows ] = await conn.query( query);
        conn.release();
        return rows;
    }

};

exports.getImage = async function (id) {
    console.log( `Request to get event ${id}'s image from the database...` );

    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.putImage = async function (imagePath, id) {
    console.log( `Request to put event ${id}'s image on the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'update event set image_filename = ? where id = ?';
    const [ rows ] = await conn.query( query, [imagePath, id] );
    const query2 = 'select * from event where id = ?';
    const [rows2] = await conn.query(query2, [id]);
    conn.release();
    return rows2;
};

exports.check = async function (id) {
    console.log('checking image authorization');

    const conn = await db.getPool().getConnection();
    const query = 'select * from event join user on user.id = event.organizer_id where event.id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.checkEventsExist = async function (id) {
    console.log('checking event exists');

    const conn = await db.getPool().getConnection();
    const query = 'select * from event where id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.findOrganizerByToken = async function (token) {
    console.log("authenticating organzier");
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where auth_token = ?';
    const [rows] = await conn.query(query, [token]);
    conn.release();
    return rows;
};

exports.check2 = async function (id) {
    console.log('checking image authorization2');

    const conn = await db.getPool().getConnection();
    const query = 'select * from event where event.id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};