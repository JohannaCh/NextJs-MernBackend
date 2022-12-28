import Event from '../../../models/Event';
import dbConnect from '../../../lib/dbConnect';
import validateJWT from '../../../middleware/validateJWT';

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

    await dbConnect();
    const events = await Event.find().populate('user', 'name');

    res.json({
        ok:true,
        events
    });
}