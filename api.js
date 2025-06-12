const express = require('express')
const app = express.Router()
const {
    fetchUsers,
    fetchProducts,
    fetchFavorites,
} = require('./db.js')

// CREATE
// READ
app.get('/users' , async (req,res,next) => {
    try {
        res.send(await fetchUsers())
    } catch (error) {
        next(error)
    }
})

app.get('/products' , async (req,res,next) => {
    try {
        res.send(await fetchProducts())
    } catch (error) {
        next(error)
    }
})

app.get('/favorites' , async (req,res,next) => {
    try {
        res.send(await fetchFavorites())
    } catch (error) {
        next(error)
    }
})
// UPDATE (NONE)
// DELETE

module.exports = app