/* eslint-disable prettier/prettier */
import { Catch, ExceptionFilter, ArgumentsHost, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Response } from 'express';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
    catch(exception: JsonWebTokenError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception.message === 'jwt expired') {
            response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Token has Expired',
            });
        } else {
            response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: exception.message,
            });
        }
    }
}