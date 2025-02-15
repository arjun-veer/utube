const asyncHandler=(requestHandler)=>{
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err))
     }

};

// const asyncHandler=()=>async (req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(err){
//         res.status(500).send({message:err.message}).json({
//             status:false,
//             message:err.message
//         }
//         )
//         next(err)
//     }
// }

    

export {asyncHandler}