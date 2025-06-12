const express = require('express')
const app = express.Router()
const {
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createUser,
    createProduct,
    createFavorite,
    destroyFavorites
} = require('./db.js')

// CREATE
app.post('/users' , async (req,res,next) => {
    try {
        res.send(await createUser(req.body))
    } catch (error) {
        next(error)
    }
})

app.post('/products' , async (req,res,next) => {
    try {
        console.log("req.body", req.body)
        res.send(await createProduct(req.body))
    } catch (error) {
        next(error)
    }
})

app.post('/favorites' , async (req,res,next) => {
    try {
        res.send(await createFavorite(req.body))
    } catch (error) {
        next(error)
    }
})

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

app.get('/users/:id/favorites' , async (req,res,next) => {
    try {
        res.send(await fetchFavorites(req.params))
    } catch (error) {
        next(error)
    }
})

// UPDATE (NONE)
// DELETE
app.delete('/users/:userId/favorites/:id' , async (req,res,next) => {
    try {
        await destroyFavorites(req.params)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})


module.exports = app