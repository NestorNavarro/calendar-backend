const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');


const createUser = async(req, res = response) =>{
    const { email, password } = req.body;
    try {
        let user = await  User.findOne({ email });

        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'The email already exist',
            });
        }
        
        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();

        const token = await generateJWT(user.id, user.name);

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });   
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please inform about this error with the admin'
        });
    }
}

const loginUser = async(req, res  = response) =>{
    const { email, password } = req.body;
    try {
        const user = await  User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'The user is incorrect',
            });
        }

        const validPassword = await bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg:'Password no valid'
            });
        }
        const token = await generateJWT(user.id, user.name);
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please inform about this error with the admin'
        });
    }
}

const revalidateToken = async(req, res  = response) => {
    const { uid, name } = req;

    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        token,
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken,
}