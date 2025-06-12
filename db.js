const pg = require('pg')
const client = new pg.Client('postgres://localhost/the_acme_store' || process.env.DATABASE_URL)
const {v4} = require('uuid')
const uuidv4 = v4

const seed = async () => {
    // CREATE TABLES
    const SQL = `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT productID_and_userID UNIQUE(product_id, user_id)
        );
    `
    await client.query(SQL)
    console.log('SUCCESS – Created Tables')
}


module.exports = {
    seed,
    client
}