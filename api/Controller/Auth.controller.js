const createError  = require("http-errors")
const User = require("../Models/User.model")
const {authSchema} = require("../Helpers/validation_schema")
const { 
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken } = require("../Helpers/jwt_helper")

    const client = require("../Helpers/init_redis")


module.exports = { 

    register: async(req, res, next) =>{
        console.log(req.body)
        try {
            
            // const {email, password} = req.body
            // if(!email || !password) throw createError.BadRequest()
    
            const result = await authSchema.validateAsync(req.body)
            
    
            const doesExist = await User.findOne ({ email: result.email })
    
            if (doesExist) throw createError.Conflict(`${result.email} is already been registered`)
    
            const user = new User(result)
            const savedUser  = await user.save();
    
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefreshToken(savedUser.id)
    
            res.send ({accessToken, refreshToken, savedUser})
        } catch (error) {
            next(error)
        }
        
    }, 

        login: async(req, res, next) =>{
            try {
                const result = await authSchema.validateAsync(req.body)
                const user = await User.findOne({ email: result.email})
        
                if(!user) throw createError.NotFound("User not registered")
        
                const isMatch = await user.isValidPassword(result.password)
        
                if(!isMatch) throw createError.Unauthorized("Username/password not valid")
        
                const accessToken = await signAccessToken(user.id)
                const refreshToken = await signRefreshToken(user.id)
        
                res.send({accessToken, refreshToken, user})
        
            } catch (error) {
        
                if(error.isJoi === true) 
                return next (createError.BadRequest("Invalid Username/Password"))
                next(error)
                
            }
        
            
        },
        
    refreshToken: async(req, res, next) => {
        try {
            const {refreshToken} = req.body
    
            if(!refreshToken) throw createError.BadRequest()
            
            const userId = await verifyRefreshToken(refreshToken)
    
            const accessToken = await signAccessToken(userId)
            const refToken  = await signRefreshToken(userId)
    
            res.send ({accessToken: accessToken, refreshToken: refToken})
    
    
    
            
        } catch (error) {
            next(error)  
        }
    },

    logout: async(req, res, next) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
            const  userId = await verifyRefreshToken(refreshToken)
            client.del(userId, (err, val) => {
    
                if (err) {
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.send("logout succesfully")
            })
        } catch (error) {
            next(error)
            
        }
    }

    
    
    
}