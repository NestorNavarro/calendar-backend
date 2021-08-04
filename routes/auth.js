/*
    User routers / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { filesValidators } = require('../middlewares/files-validators');
const { validatorJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
    '/new', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The eamil is required').not().isEmpty(),
        check('email', 'The email dose not have a good format').isEmail(),
        check('password', 'The password must be have 6 characters').isLength({ min: 6}),
        filesValidators,
    ],
    createUser );

router.post(
    '/',   
    [
        check('email', 'The eamil is required').not().isEmpty(),
        check('email', 'The email dose not have a good format').isEmail(),
        check('password', 'The password must be have 6 characters').isLength({ min: 6}),
        filesValidators,
    ],
    loginUser );

router.get('/renew', validatorJWT, revalidateToken);

module.exports = router;