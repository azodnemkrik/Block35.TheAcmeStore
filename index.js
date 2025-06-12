const express = require('express')
const app = express()
const {
    seed,
    client
} = require('./db')

const init = async () => {
    // MAKE CONNECTION TO DB
    await client.connect()
    console.log('SUCCESS - Connected to DATABASE.')

    // MAKE TABLES
    await seed()

    // CREATE PORT & LISTEN
    const PORT = 3000 || process.env.PORT
    app.listen(PORT, () => {
        console.log(`SUCCESS - Listening at PORT: ${PORT}`)
    })

}

init()