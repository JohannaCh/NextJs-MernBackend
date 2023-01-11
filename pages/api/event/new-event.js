import { validationResult } from 'express-validator';
import eventDataMid from '../../../middleware/eventDataMid';
import validateMiddleware from '../../../middleware/validateFields';
import initMiddleware from '../../../middleware/initMiddleware';
import validateJWT from '../../../middleware/validateJWT';
import Event from '../../../models/Event';
import dbConnect from '../../../lib/dbConnect';
import Cors from 'cors'


const cors = Cors({
    methods: ['POST', 'HEAD'],
})
  

const validateEvent = initMiddleware(
    validateMiddleware(eventDataMid, validationResult)
)

function checkCors(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export default async function handler(req, res) {
    await checkCors(req, res, cors);
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