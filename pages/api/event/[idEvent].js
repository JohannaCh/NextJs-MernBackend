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

    await dbConnect();
    
    const { method } = req;
    if (method === "PUT") {
            await validateEvent(req, res);
            const idEvent = req.query.idEvent;
  
            try { 
                const event = await Event.findById(idEvent)
  
                if (!event) {
                    return res.status(404).json({
                      ok:false,
                      msg:'No se encontró ningún evento con ese id'
                    });
                }
  
                if (event.user.toString() !== uid) {
                    return res.status(401).json({
                        ok:false,
                        msg:'No cuenta con los permisos para editar este evento'
                    });
                }
  
                const newEvent = {
                    ...req.body,
                    user:uid
                };
  
                await Event.findByIdAndUpdate(idEvent, newEvent, {new:true});
                
                res.status(200).json({
                    ok:true,
                    msg:'Evento actualizado'
                });
                
  
            } catch (error) {
                res.status(500).json({
                    ok:false,
                    msg:'Ocurrio algo inesperado'
                });
            }
        }
      
        if (method === "DELETE") {
            const idEvent = req.query.idEvent;    
            try { 
                const event = await Event.findById(idEvent)
    
                if (!event) {
                    return res.status(404).json({
                        ok:false,
                        msg:'No se encontró ningún evento con ese id'
                    });
                }
    
                if (event.user.toString() !== uid) {
                    return res.status(401).json({
                        ok:false,
                        msg:'No cuenta con los permisos para eliminar este evento'
                    });
                }
    
                await Event.findByIdAndDelete(idEvent)
               
                res.status(200).json({
                    ok:true,
                    msg:'Evento eliminado correctamente'
                });
                
            } catch (error) {
                res.status(500).json({
                    ok:false,
                    msg:'Ocurrio algo inesperado'
                });
            }
        }
}