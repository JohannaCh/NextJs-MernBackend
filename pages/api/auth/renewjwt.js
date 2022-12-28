import { generateJWT } from '../../../helpers/jwt';

export default async function handler(req, res) {

    const { uid, name } = req;

    //generar el JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok:true,
        token
    });
}