const db = require('../../config/db');

exports.getImage = async function (id) {
    console.log( `Request to get user ${id}'s image from the database...` );

    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.putImage = async function (img, id) {
    console.log( `Request to put user ${id}'s image on the database...` );
    const conn = await db.getPool().getConnection();
    const query = 'update user set image_filename = ? where id = ?';
    const [ rows ] = await conn.query( query, [img, id] );
    const query2 = 'select * from user where id = ?';
    const [rows2] = await conn.query(query2, [id]);
    conn.release();
    return rows2;

};

exports.check = async function (id) {
    console.log('checking image authorization');

    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.deleteImage = async function (id) {
    console.log(`deleting user ${id}'s image `);
    const conn = await db.getPool().getConnection();
    const query = 'update user set image_filename = NULL where id = ?';
    const [ rows ] = await conn.query( query, [ id] );
    const query2 = 'select * from user where id = ?';
    const [rows2] = await conn.query(query2, [id]);
    conn.release();
    return rows2;

};