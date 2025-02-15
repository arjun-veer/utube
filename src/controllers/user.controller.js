import {asyncHandler} from "./utlis/asyncHandler";
import {ApiError} from "../utlis/ApiError.js";
import {User} from "../models/user.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import {uploadOnCloudinary} from "../utlis/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({ message: "User registered successfully" });

    //get user data from frontend
    // validate user data
    // check if user already exists: username and email
    // check for image, chec for avatar
    // upload them to cloudinary
    //avatar uploadedd check
    //create user object
    //create entry call for mongodb
    //remove password and referesh token field from response
    // check for user creation
    // return response

    const {fullname, email, username,password}=req.body
    console.log("email:", email);

    // if (fullname === "" || email === "" || username === "" || password === "") {
    //     res.status(400).json({ message: "All fields are required" });
    //     throw new ApiError(400, "All fields are required");
    // }
    if ([fullname, email, username, password].some((field) => field?.trim() === "" ) ){    // if any of the fields is empty
        
        res.status(400).json({ message: "All fields are required" });
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });  // check if user already exists
    if (existedUser) {
        res.status(409).json({ message: "User already exists" });
        throw new ApiError(409, "User already exists");
    }

    // check for image, chec for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath ) {
        res.status(400).json({ message: "Avatar and cover image are required" });
        throw new ApiError(400, "Avatar  are required");
    }

    // upload them to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath, (avatarLocalPath))
    const coverImage = await uploadOnCloudinary(coverImageLocalPath, (coverImageLocalPath))
    
    if (!avatar || !coverImage) {
        res.status(500).json({ message: "Failed to upload image" });
        throw new ApiError(500, "Failed to upload image");
    }

    //create user object

    const user = await User.create({
        fullname,
        email,
        username : username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
    });

   const createdUser = User.findById(user._id).select("-password -refreshToken")  
   
   if(!createdUser){
       res.status(500).json({message:"Failed to create user"})
       throw new ApiError(500, "Failed to create user");
   }

   return res.status(201).json(new ApiResponse(201, "User registered successfully", createdUser));

});


export { registerUser };
