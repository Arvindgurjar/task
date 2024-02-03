const express = require('express')
const app = express()
const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})
require("./connection/connection")
app.use(express.json())
app.use(require("./router/router"))
const port = 4200
app.listen(port, () => console.log(`Example app listening on port ${port}!`))