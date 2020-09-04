module.exports = (req, res, next) => {
    //data, whith will add in each layout
    res.locals.isAuth = req.session.isAuth;
    res.locals.HOST = 'http://localhost:3000/'
    next(); // to continue execution
}