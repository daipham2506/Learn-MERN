const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const gravatar = require("gravatar")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const config = require("config")

const User = require("../../models/User")

// @route   POST api/users
// @Access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('password')
            .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
            .matches(/\d/).withMessage('Password must contain a number'),
        check('email', 'Please include valid email').isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }

        const { name, email, password } = req.body

        try {
            // see if user exist
            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                })
            }

            //get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                password,
                avatar,
            })

            //encrypt password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            await user.save()

            //return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token)=>{
                    if(err){
                        throw err;
                    }
                    res.json({token})
                }
            )
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error")

        }
    })

module.exports = router