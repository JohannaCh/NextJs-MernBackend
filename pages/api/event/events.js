import Event from '../../../models/Event';
import dbConnect from '../../../lib/dbConnect';
import validateJWT from '../../../middleware/validateJWT';
import Cors from 'cors'

const cors = Cors({
    methods: ['POST', 'HEAD'],
  })
  
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

    await dbConnect();
    const events = await Event.find().populate('user', 'name');

    res.json({
        ok:true,
        events
    });
}