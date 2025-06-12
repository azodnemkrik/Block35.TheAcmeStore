const pg = require('pg')
const client = new pg.Client('postgres://localhost/the_acme_store' || process.env.DATABASE_URL)
const {v4} = require('uuid')
const uuidv4 = v4
const bcrypt = require('bcrypt')

//CREATE
const createUser = async (user) => {
    // Check for invalid values (combination of 'spaces' used as characters. We don't want that. )
    if(!user.username.trim() || !user.password.trim()){
        throw Error('Sorry, you must have a valid username and password.')
    }

    // Salt Bae your Passwords with bcrypt.hash()
    user.password = await bcrypt.hash(user.password, 6)

    const SQL = `
        INSERT INTO users
        (id, username, password)
        VALUES
        ($1, $2, $3)
        RETURNING *
    `
    const response = await client.query(SQL , [uuidv4(), user.username, user.password])
    return response.rows[0]
}

const createProduct = async (product) => {
    const SQL = `
        INSERT INTO products
        (id, name)
        VALUES
        ($1, $2)
        RETURNING *
    `
    const response = await client.query(SQL , [uuidv4(), product.name])
    return response.rows[0]
}

const createFavorite = async (favorite) => {
    const SQL = `
        INSERT INTO favorites
        (id, product_id, user_id)
        VALUES
        ($1, $2, $3)
        RETURNING *
    `
    const response = await client.query(SQL , [uuidv4(), favorite.product_id, favorite.user_id])
    return response.rows[0]
}

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
            name VARCHAR(100) UNIQUE NOT NULL
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT productID_and_userID UNIQUE(product_id, user_id)
        );
    `
    await client.query(SQL)
    
    // CREATE FILLER DATA - USERS
    const [kirk, kathy, mae, devin, haleigh, meatball] = await Promise.all([
        createUser({username: "kirkmendoza", password: "1111"}),
        createUser({username: "kathleenmendoza", password: "2222"}),
        createUser({username: "maeserenitymendoza", password: "3333"}),
        createUser({username: "devinhalicki", password: "4444"}),
        createUser({username: "haleighhalicki", password: "5555"}),
        createUser({username: "meatball", password: "6666"}),
    ])

    // CREATE FILLER DATA - PRODUCTS
    const [ruler, paper, pen, pencil, paperClip, mug, snacks] = await Promise.all([
        createProduct({name: "Ruler"}),
        createProduct({name: "Paper"}),
        createProduct({name: "Pen"}),
        createProduct({name: "Pencil"}),
        createProduct({name: "Paper Clip"}),
        createProduct({name: "Mug"}),
        createProduct({name: "Snacks"}),
    ])

    // CREATE FILLER DATA - FAVORITES
    const [] = await Promise.all([
        createFavorite({product_id: paper.id, user_id: kirk.id}),
        createFavorite({product_id: ruler.id, user_id: kirk.id}),
        createFavorite({product_id: ruler.id, user_id: mae.id}),
        createFavorite({product_id: snacks.id, user_id: devin.id}),
        createFavorite({product_id: snacks.id, user_id: haleigh.id}),
        createFavorite({product_id: snacks.id, user_id: kathy.id}),
        createFavorite({product_id: snacks.id, user_id: kirk.id}),
        createFavorite({product_id: snacks.id, user_id: mae.id}),
        createFavorite({product_id: snacks.id, user_id: meatball.id}),
        createFavorite({product_id: paperClip.id, user_id: meatball.id}),
        createFavorite({product_id: pencil.id, user_id: kathy.id}),
        createFavorite({product_id: pen.id, user_id: kathy.id}),
    ])

    console.log('SUCCESS – Created tables and seeded data.')
}


module.exports = {
    seed,
    client
}