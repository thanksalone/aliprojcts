export const errorMidleware = (err, reqr, res, next) => {
    err.message || (err.message = "internal Server Error");
    err.statusCode || (err.statusCode = 500);
    return res.status(err.statusCode).json({
        sucess: true,
        message: err.message
    });
};
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
