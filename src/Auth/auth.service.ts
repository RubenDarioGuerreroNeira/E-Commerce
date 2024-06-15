
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common"
import { Users } from "src/Entities/Users.entity";
import { UsersRepository } from "src/Users/usersRepository";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository,
        private readonly jwstService: JwtService
    ) { }

    getauth(): string {
        return 'Return Auth';
    }

    async sigIn(email: string, password: string) {
        // Verificar si el email y la contraseña fueron proporcionados

        if (!email || !password) {
            throw new BadRequestException("Email and password are required");
        }

        console.log('Received email:', email);
        console.log('Received password:', password);

        const user = await this.usersRepository.GetByEmail(email);
        if (!user) {
            throw new BadRequestException("Invalid Credentials");
        }

        console.log('User found:', user);

        const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
        const token = this.jwstService.sign(payload);

        console.log('Token:', token);
        console.log('User found:', user);
        return { token, message: 'User logged in' };
    }

    async signUp(user: Partial<Users>) {
        const { email, password } = user
        const foundUser = await this.usersRepository.GetByEmail(email)
        if (foundUser) {
            throw new BadRequestException('User already Registered')
        }
        const hashPassword = await bcrypt.hash(password, 12)
        return await this.usersRepository.addUser({ ...user, password: hashPassword })
    }
}



