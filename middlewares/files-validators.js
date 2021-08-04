const { response } = require('express-validator');
const { validationResult } = require('express-validator');

const filesValidators = (req, res = response, next ) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped(),
        });
    } 
    next();
}

module.exports = {
    filesValidators,
}