const db = require('../../config/db');

exports.insert = async function(email, first_name, last_name, password){
    console.log( `Request to insert ${first_name} into the database...` );

    const conn = await db.getPool().getConnection();
    const validEmail = 'select * from user where email = ?';
    const [ verify ] = await conn.query(validEmail, [email]);
    if (verify.length === 1) {
        conn.release();
        return verify;
    }
    const query = 'insert into user (email, first_name, last_name, password) values ( ?, ?, ?, ?)';
    const [ result1 ] = await conn.query( query, [ email, first_name, last_name, password ] );
    const query1 = 'select * from user where email = ?';
    const [result] = await conn.query(query1, [email]);
    conn.release();
    return result;
};

exports.getOne = async function(id){
    console.log( `Request to get user ${id} from the database...` );

    const conn = await db.getPool().getConnection();
    const query = 'select first_name, last_name, email, auth_token  from user where id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

exports.login = async function(token, email) {
    console.log( `Request to login ${email} to the database...` );
    const conn = await db.getPool().getConnection();
    const validEmail = 'select email from user where email = ?';
    const [ verify ] = await conn.query(validEmail, [email]);
    if (verify.length === 0) {
        conn.release();
        return verify;
    } else {
        const query = 'update user set auth_token = ? where email = ?';
        const [rows1] = await conn.query(query, [token, email]);
        const query2 = 'select id as UserId, auth_token as token, password from user where email = ?';
        const [ rows ] = await conn.query(query2, [email]);
        conn.release();
        return rows;
    }
};

exports.logout = async function(token) {
    console.log( `Request to logout.` );

    const conn = await db.getPool().getConnection();
    const validAuth = 'select auth_token from user where auth_token = ?';
    const [valid] = await conn.query(validAuth, [token]);
    if (valid.length === 0) {
        conn.release();
        return valid;
    }
    const query = 'update user set auth_token = NULL where auth_token = ?';
    const [rows] = await conn.query(query, [token]);
    conn.release();
    return rows;
};

exports.updateFirstName = async function(firstName, id, token) {
    console.log( `Request to alter ${firstName}...` );

    const conn = await db.getPool().getConnection();
    const query = 'update user set first_name = ? where id = ? and auth_token = ?';
    const [ rows ] = await conn.query( query, [ firstName , id, token] );
    const checkQuery = 'select * from user where first_name = ? and id = ? and auth_token = ?';
    const [ checkRows ] = await conn.query( checkQuery, [ firstName , id, token] );
    conn.release();
    return checkRows;
};

exports.updateLastName = async function(lastName, id, token) {
    console.log( `Request to alter ${lastName}...` );

    const conn = await db.getPool().getConnection();
    const query = 'update user set last_name = ? where id = ? and auth_token = ?';
    const [ rows ] = await conn.query( query, [ lastName , id, token] );
    const checkQuery = 'select * from user where last_name = ? and id = ? and auth_token = ?';
    const [ checkRows ] = await conn.query( checkQuery, [ lastName , id, token] );
    conn.release();
    return checkRows;
};

exports.updateEmail = async function(email, id, token) {
    console.log( `Request to alter ${email}...` );

    const conn = await db.getPool().getConnection();
    const query = 'update user set email = ? where id = ? and auth_token = ?';
    const [ rows ] = await conn.query( query, [ email , id, token] );
    const checkQuery = 'select * from user where email = ? and id = ? and auth_token = ?';
    const [ checkRows ] = await conn.query( checkQuery, [ email , id, token] );
    conn.release();
    return checkRows;
};

exports.updatePassword = async function(newPass, id, token) {
    console.log( `Request to alter user ${id}...` );

    const conn = await db.getPool().getConnection();
    const query = 'update user set password = ? where id = ? and auth_token = ?';
    const [ rows ] = await conn.query( query, [ newPass , id, token] );
    const checkQuery = 'select * from user where password = ? and id = ? and auth_token = ?';
    const [ checkRows ] = await conn.query( checkQuery, [ newPass , id, token] );
    conn.release();
    return checkRows;
};

exports.findUserByToken = async function (token) {
      console.log("authenticating user");
      const conn = await db.getPool().getConnection();
      const query = 'select * from user where auth_token = ?';
      const [rows] = await conn.query(query, [token]);
      conn.release();
      return rows;
};

exports.exist = async function (id) {
    console.log("checking user exists");

    const conn = await db.getPool().getConnection();
    const query = 'select * from user where id = ?';
    const [rows] = await conn.query(query, [id]);
    conn.release();
    return rows;
};

exports.findAttendeeByToken = async function (token) {
    console.log("authenticating user");
    const conn = await db.getPool().getConnection();
    const query = 'select * from user where auth_token = ?';
    const [rows] = await conn.query(query, [token]);
    conn.release();
    return rows;
};