/* eslint-disable prettier/prettier */
import { Inject, Injectable, /*Put*/ } from "@nestjs/common"
import { UsersRepository } from "./usersRepository";
import { Users } from 'src/Entities/Users.entity'
// import { create } from "domain";
// import { UserEntity } from "./user.Entity";

@Injectable()

export class UsersService {
    constructor(private userRepository: UsersRepository, @Inject("ACCES_TOKEN") private accesToken: number) { }


    getUsers(page: number, limit: number) {
        return this.userRepository.getUser(page, limit)
    }

    getByID(id: string) {

        return this.userRepository.getUserById(id)
    }

    addUser(user: any) {
        return this.userRepository.addUser(user)
    }

    async getByemail(email: string): Promise<Partial<Users>> {
        return this.userRepository.GetByEmail(email)
    }


    updateUser(id: string, user: any) {
        return this.userRepository.updatetUsers(id, user)
    }


    deleteUser(id: string) {
        return this.userRepository.deleteUser(id)
    }


}



