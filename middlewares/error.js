class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
    }
    
}


export const errorMiddleware = (err,req,res,next) => {
    return res.status(404).json({
    success: false,
    message: "Invalid id",
})
};

export default ErrorHandler;