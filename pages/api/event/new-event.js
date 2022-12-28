import { validationResult } from 'express-validator';
import eventDataMid from '../../../middleware/eventDataMid';
import validateMiddleware from '../../../middleware/validateFields';
import initMiddleware from '../../../middleware/initMiddleware';
import validateJWT from '../../../middleware/validateJWT';
import Event from '../../../models/Event';
import dbConnect from '../../../lib/dbConnect';


const validateEvent = initMiddleware(
    validateMiddleware(eventDataMid, validationResult)
)

export default async function handler(req, res) {
    let uid;
    try {
        const tokenDecoded = validateJWT(req);
        uid = tokenDecoded.uid;
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: error.message
        });
    }

    await validateEvent(req, res);
    const event = new Event(req.body);
    await dbConnect();
        
    try {
        event.user = uid;
        const eventCreated = await event.save();
        res.status(201).json({
            ok:true,
            eventCreated
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:"no se pudo crear el evento"
        });
    }
}