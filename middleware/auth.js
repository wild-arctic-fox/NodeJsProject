module.exports = (req, res, next) => {
    if(!req.session.isAuth){
        return res.redirect("/login#login");
    }

    next(); // to continue execution
}