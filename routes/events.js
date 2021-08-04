/*
    host + /api/event
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { filesValidators } = require('../middlewares/files-validators');
const { validatorJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(validatorJWT);

router.get('/',getEvents);

router.post('/',
    [
        check('title', 'The title is required').not().isEmpty(),
        check('start', 'The start date is required').custom(isDate),
        check('end', 'The end date is required').custom(isDate),
        filesValidators
    ], 
    createEvent
);

router.put('/:id',
    [
        check('title', 'The title is required').not().isEmpty(),
        check('start', 'The start date is required').custom(isDate),
        check('end', 'The end date is required').custom(isDate),
        filesValidators
    ],
    updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;