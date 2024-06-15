/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controllers";
import { UsersService } from "./users.service";
import { UsersRepository } from "./usersRepository";
import { Users } from "src/Entities/Users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

const clave = 123;
@Module({
    imports: [TypeOrmModule.forFeature([Users]),],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository,
        {
            provide: "ACCES_TOKEN",
            useValue: clave
        }
    ],
})


export class UsersModule { }