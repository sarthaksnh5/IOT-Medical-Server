// importing
const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')

// app initializing
const app = express()

var corsOptions = {
    origin: "http://localhost:3000"
}

// setting up cors options
app.use(cors(corsOptions))

// parse requests of content-type - application/json, application/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
    cookieSession({
        name: "temp-session",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true
    })
)

const db = require('./models')
const dbConfig = require('./config/db.config')

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB")
}).catch(e => {
    console.log(`Error: ${e}`)
    process.exit()
})

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to heart rate"})
})

// user and auth routes
require("./routes/auth.routes")(app)
require("./routes/user.routes")(app)

// set port, listen
const PORT = 8080;
app.listen(PORT,() => {
    console.log(`Server is running on ${PORT}`)
})