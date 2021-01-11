
const authMiddleware = (req, res, next) => {
    if(!req.isAuth){
        res.status(403).send('Not authenticate');
        return;
    }
    next()
}
module.exports = authMiddleware;