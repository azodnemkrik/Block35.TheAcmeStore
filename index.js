const express = require('express')
const app = express()

const init = () => {

    const PORT = 3000
    app.listen(PORT, () => {
        console.log(`Listening at PORT: ${PORT}`)
    })

}

init()