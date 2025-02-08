import e from "express";
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,  //cloudinary link
            required:true,
        },
        coverImage:{
            type:String,  //cloudinary link
        },
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }],
        password:{
            type:String,
            required:[true,'Password is required'],
        },
        refreshToken:{
            type:String
        },
    },{timestamps:true}
)

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})



userSchema.methods.generateAccessToken = function(){
    return jwt.sign({id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({id:this._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
}

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    return user;
}



export const User = mongoose.model("User". userSchema);