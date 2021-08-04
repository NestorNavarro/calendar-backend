const { response } = require('express');
const { ResultWithContext } = require('express-validator/src/chain');
const Event = require('../models/Event');


const getEvents = async(req, res = response ) => {
    const events = await Event.find()
                                .populate('user', 'name');

    return res.status(201).json({
        ok: true,
        msg: events,
    });
}

const createEvent = async(req, res = response) => {
    const event = new Event(req.body);
    try {
        event.user = req.uid;
       const eventSaved =  await event.save();
        return res.status(201).json({
            ok: true,
            msg: eventSaved,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Inform about this problem to the admin'
        })
    }
}

const updateEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);
        if(!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found',
            });
        }

        if(event.user.toString() !== uid){
            res.status(401).json({
                ok: false,
                msg: 'The user is not allowed to do this action',
            });
        }
        const newEvent ={
            ...req.body,
            user: uid,
        };
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true });

        return res.status(201).json({
            ok: true,
            event: eventUpdated,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Inform about this problem to the admin'
        });
    }
}

const deleteEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);
        if(!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found',
            });
        }

        if(event.user.toString() !== uid){
            res.status(401).json({
                ok: false,
                msg: 'The user is not allowed to do this action',
            });
        }
        await Event.findOneAndDelete(eventId);

        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Inform about this problem to the admin'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}