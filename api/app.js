const express = require("express");
const morgan = require("morgan")
const createError = require("http-errors");
require("dotenv").config()
require("./Helpers/init_mongo")




const AuthRoute = require("./Routes/Auth.route");

const postRoute = require ("./Routes/postRoute");
const { verifyAccesstoken } = require("./Helpers/jwt_helper");
require("./Helpers/init_redis")







const app = express()

app.use(morgan("dev"))

app.use(express.json())
 
app.use(express.urlencoded({extended:true}))





app.get('/', verifyAccesstoken, async(req, res, next) => {


    
    res.send("Hello from express");  
})

app.use("/auth", AuthRoute)
app.use("/notes", postRoute)

app.use(async(req, res, next) =>{

    // const error  = new Error ("Not found")
    // error.status = 404
    // next(error)

    next(createError.NotFound("The route doesn't exist"))
})


app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500, 
            message: err.message
        }
    })
})

const PORT = process.env.PORT  || 30000

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
} 
)
