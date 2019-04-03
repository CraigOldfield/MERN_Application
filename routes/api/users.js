const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// @route  POST api/users
// @desc   Register new user
// @access Public
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    //validation
    if(!name || !email || !password){
        //400 = bad request
        return res.status(400).json({msg: 'Please enter all fields' });
    }

    //check for an existing user
    User.findOne({ email: email })
        .then(user => {
            if(user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            const newUser = new User({
                name,
                email,
                password
            });

            //Generating SALT and Hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                //3600 says expire in 1hr...
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if(err){
                                        throw err;
                                    }
                                    res.json({
                                        token: token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    });
                                }
                            )
                        });
                });
            });
        });
});

module.exports = router;