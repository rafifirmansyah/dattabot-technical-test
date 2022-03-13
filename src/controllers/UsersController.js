import db from '../databases/postgres.js';
import Users from '../models/Users.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UsersController = {
    registerValidation: [
        check('email')
            .notEmpty()
            .withMessage('The email is required.')
            .isEmail()
            .withMessage('Please enter a valid email, example: user@example.com.')
            .isLength({ min: 6})
            .withMessage('The email must be at least 6 character.')
            .isLength({ max: 255})
            .withMessage('The email must be a maximum of 255 character.')
            .custom(async value => {
                const user = await Users.exists(value);

                if (user.exists) {
                    return Promise.reject('This email is already registered, please enter another email.');
                }
            }),
        check('password')
            .notEmpty()
            .withMessage('The password is required.')
            .isLength({ min: 6})
            .withMessage('The password must be at least 6 character.')
            .isLength({ max: 255})
            .withMessage('The password must be a maximum of 255 character.')
    ],

    async register(req, res) {
        // Validation
        const errors = validationResult(req);

        // If validation fails
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.mapped());
        }

        try {
            // Hashing password
            req.body.password = bcrypt.hashSync(req.body.password, 10);

            const userData = {
                email: req.body.email,
                password: req.body.password
            };

            // Transaction
            await db.tx(async transaction => {
                // Create User
                await Users.create(transaction, userData);
            });

            return res.status(201).json({
                status: 'Success',
                message: 'User successfully created.'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'Failed',
                message: 'User failed to create.'
            });
        }                    
    },

    loginValidation: [
        check('email')
            .notEmpty()
            .withMessage('The email is required.')
            .isEmail()
            .withMessage('Please enter a valid email, example: user@example.com.')
            .custom(async value => {
                const user = await Users.exists(value);

                if (!user.exists) {
                    return Promise.reject('Your email is not registered, please register first.');
                }
            }),
        check('password')
            .notEmpty()
            .withMessage('The password is required.')
    ],

    async login(req, res) {
        // Validation
        const errors = validationResult(req);

        // If validation fails
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.mapped());
        }

        try {
            const user = await Users.getByEmail(req.body.email);

            // Compare password after hashed with password from request
            const isSamePassword = bcrypt.compareSync(req.body.password, user.password);

            if (isSamePassword) {
                // Generate JWT Signature
                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                }, process.env.JWT_KEY);

                return res.status(200).json({
                    status: 'Success',
                    message: 'Login successfully.',
                    data: {
                        token: token
                    }
                });
            } else {
                return res.status(422).json({
                    password: {
                        value: req.body.password,
                        msg: 'Your password is wrong, please check your password again.',
                        param: 'password',
                        location: 'body'
                    }
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'Failed',
                message: 'Failed to login.'
            });
        }
    }
};

export default UsersController;