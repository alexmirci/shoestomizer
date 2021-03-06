
const express = require("express")
const router = express.Router()



function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

router.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs')
})

module.exports = router






