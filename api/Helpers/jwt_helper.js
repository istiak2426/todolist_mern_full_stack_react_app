const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const client  = require("./init_redis")

module.exports = {
    signAccessToken: (userId) =>{

        return new Promise ((resolve,reject) => {
            const payload = {
                // name: "istiak shanto",
                // iss: "shanto"
                // aud: userID
            }

            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "60s",
                issuer: "shanto",
                audience: userId

            }

            JWT.sign(payload, secret, options, (err, token) =>{
                if (err) {
                    console.log(err.message)
                    // reject (err)
                    reject (createError.InternalServerError())
                } 
                resolve(token)
            })

            
        })
    },

    
    verifyAccesstoken: (req, res, next) => {
        if (!req.headers["authorization"]) 
        return next(createError.Unauthorized())
        const authHeader = req.headers["authorization"]
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){

            // if (err.name === "JsonWebTokenError")
            // {
                
            //     return next(createError.Unauthorized())
            // }
            // else 
            // {
            //     return next(createError.Unauthorized(err.message))
            // }

            const message = err.name === "JsonWebTokenError" ? "Unauthorized"  : err.message
            return next (createError.Unauthorized(message))

        }
            req.payload = payload
            next()
        })
    },

    signRefreshToken: (userId) =>{

        return new Promise ((resolve,reject) => {
            const payload = {
                // name: "istiak shanto",
                // iss: "shanto"
                // aud: userID
            }

            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: "1y",
                issuer: "shanto",
                audience: userId

            }

            JWT.sign(payload, secret, options, (err, token) =>{
                if (err) {
                    console.log(err.message)
                    // reject (err)
                    reject (createError.InternalServerError())
                } 

                client.set(userId, token, "EX", 365 * 24* 60 * 60, (err, reply) => {
                    if(err) 
                    {
                        console.log(er.message)
                        reject (createError.InternalServerError())
                        return
                    
                    }
                    resolve(token)
                })
                
            })

            
        })
    },

    verifyRefreshToken: (refreshToken) =>{
        return new Promise((resolve, reject) =>{
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject (createError.Unauthorized())
                const userId  = payload.aud

                resolve(userId)
            })
        })
    }

}