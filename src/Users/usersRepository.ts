/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common"
// import { UserEntity } from "./user.Entity"
import { Users } from "src/Entities/Users.entity"
import { /*LimitOnUpdateNotSupportedError*/ Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()

export class UsersRepository {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>,) {
    }

    async getUser(page: number, limit: number): Promise<Partial<Users>[]> {
        let users = await this.userRepository.find()
        const start = (page - 1) * limit
        const end = start + + limit;
        users = users.slice(start, end)
        return users.map(({ password, ...user }) => user)
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id }, relations: { orders: true } })

        if (!user) {
            return 'User not Found'
        }
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword

    }

    async addUser(user: Partial<Users>): Promise<Partial<Users>> {
        const newUser = await this.userRepository.save(user)
        const { password, ...userWithoutPassword } = newUser
        // return userWithoutPassword
        return newUser
    }



    async updatetUsers(id: string, user: Users): Promise<Partial<Users>> {
        await this.userRepository.update(id, user)

        const UpdateUser = await this.userRepository.findOneBy({ id })
        const { password, ...userWithoutPassword } = UpdateUser
        return userWithoutPassword
    }

    async deleteUser(id: string): Promise<Partial<Users>> {
        const user = await this.userRepository.findOneBy({ id })
        this.userRepository.remove(user)
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    async GetByEmail(email: string): Promise<Partial<Users>> {
        try {
            const user = await this.userRepository.findOneBy({ email });
            if (!user) {
                return null; // Retorna null si no se encuentra el usuario
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }







}