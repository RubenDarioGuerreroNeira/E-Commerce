/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, UserDto } from 'src/Users/users.Dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller("aut")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    getAuth(): string {
        return this.authService.getauth();
    }

    @Post('sigin')
    sigin(@Body() credentials: LoginUserDto) {
        const { email, password } = credentials;
        return this.authService.sigIn(email, password)
    }

    @Post('signup')
    signUp(@Body() user: UserDto) {
        return this.authService.signUp(user)
    }
}
