import { validationResult } from 'express-validator'
import User from '../../../models/User';
import initMiddleware from '../../../middleware/init';
import registerForm from '../../../middleware/registerForm';
import validateMiddleware from '../../../middleware/validate';
import dbConnect from '../../../lib/dbConnect';
import { generateJWT } from '../../../helpers/jwt';
const bcrypt = require('bcryptjs');

const validateBody = initMiddleware(
    validateMiddleware(registerForm, validationResult)
)

export default async function handler(req, res) {
    await validateBody(req, res);

    const { email, password } = req.body;
    await dbConnect();

        try {
            let user = await User.findOne({email: email});
            if (user) {
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un registro con ese email'
                })
            }

            user = new User(req.body);

            //encriptar contraseña
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);

            await user.save();

            //generar JWT
            const token = await generateJWT(user.id, user.name);
    
            res.status(201).json({
                ok:true,
                uid:user.id,
                name:user.name,
                token
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Fallo el registro',
            });
        }
}