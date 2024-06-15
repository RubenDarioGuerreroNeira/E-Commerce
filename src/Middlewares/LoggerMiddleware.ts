/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

/* EJEMPLO DE MIDD PARA USO LOCAL 
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Request received: ${req.method},${req.url}`);

        next();
    }
}

*/

export function LoggerMiddleware(req, Request, res: Response, next: NextFunction) {
    const ahora = new Date()

    console.log(`Estas ejecutando el metodo: ${req.method}, en la URL: ${req.url}`)
    console.log("Dia de Creación ", ahora.getDay)
    console.log("Hora  de Creación ", ahora.getHours)

    next()
}