const express = require('express')
const app = express()
const http = require('http').createServer(app)

const path = require('path')
const ROOT = path.resolve(`${__dirname}/../`)
app.use(express.static(ROOT+'/public'))

  
app.get('*', function(req, res, next) {
    res.sendFile(ROOT+'/public/index.html')
})

// const db = require("./db")
// const socket_routes = require('./socket_routes.js')
// const main_routes = require('./main_routes.js')

// db.connect('mongodb://localhost:27017',  'b33p-test2')


// app.use(express.static(ROOT+'/uploads'))


// //socket_routes(io, db)
// main_routes(app, db)


const PORT = process.env.PORT || 1234
http.listen(PORT, () => console.log('listening on *:'+PORT))