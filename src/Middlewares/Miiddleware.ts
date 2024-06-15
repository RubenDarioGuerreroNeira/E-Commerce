/* eslint-disable prettier/prettier */
import { NestMiddleware, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            next();
        } catch (err) {
            this.handleError(err, res);
        }
    }

    handleError(err: any, res: Response) {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = 'ERR_INTERNAL_SERVER';
        let message = 'Lo sentimos, ha ocurrido un error interno en nuestro servidor.';
        let details: any = {};

        if (err instanceof HttpException) {
            statusCode = err.getStatus();
            errorCode = `ERR_${statusCode}`;
            message = err.message;
            details = err.getResponse();
        } else {
            details = {
                module: 'app',
                function: 'handleError',
                error: err.toString(),
            };
        }

        res.status(statusCode).json({
            status: 'error',
            statusCode,
            errorCode,
            message,
            timestamp: new Date().toISOString(),
            details,
        });
    }
}
