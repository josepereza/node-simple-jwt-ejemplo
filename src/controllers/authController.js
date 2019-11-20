var express = require('express');
var router = express.Router();


const User = require('../models/User');
const verifyToken = require('./verifyToken')

const jwt = require('jsonwebtoken');
const config = require('../config');



router.post('/signup', async (req, res) => {
    try {
        // Receiving Data
        const { username, email, password } = req.body;
        // Creating a new User
        const user = new User({
            username,
            email,
            password
        });
        user.password = await user.encryptPassword(password);
        await user.save();
        // Create a Token
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });

        res.json({ auth: true, token });

    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }
});
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

router.get('/me', verifyToken, async (req, res) => {
    console.log("llegado a me");
    console.log("este es el user id"+ req.userId);
    //res.status(200).send(decoded);//
    // Search the Info base on the ID
     //const user = await User.findById(req.userId);
    const user = await User.findById(req.userId, { password: 0});
    if (!user) {
        return res.status(404).send("No user found.");
    }
    console.log('ultimo'+user);
    
    //res.send(user);
    // res.send('<h1>PAGINA PROTEGIDA</h1>');  
     res.render('protegido')
});

router.post('/signin', async (req, res) => {
    console.log("ha llegado");
    console.log(req.body);
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return res.status(404).send("The email doesn't exists")
    }
    const validPassword = await user.comparePassword(req.body.password, user.password);
    if (!validPassword) {
        return res.status(401).send({auth: false, token: null});
    }
    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    });
    res.status(200).json({auth: true, token});
});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;