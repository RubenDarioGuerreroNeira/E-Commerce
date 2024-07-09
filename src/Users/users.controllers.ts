/* eslint-disable prettier/prettier */
import { Post, Delete, Body, Param, UseGuards, Put, Query, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDto } from './users.Dto';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/Decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags,ApiOperation } from '@nestjs/swagger';
import { Users } from 'src/Entities/Users.entity';


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: ' Create User' })
    create(@Body() user: UserDto) {
        return this.usersService.addUser(user)
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: ' Get User/Provide Page Init and Limit' })
    // @Roles(Role.Admin)
    // @UseGuards(AuthGuard, RolesGuard)
    getUsers(@Query('page') page: number, @Query('limit') limit: number) {
        if (page && limit) {
            return this.usersService.getUsers(page, limit)
        }
        return this.usersService.getUsers(1, 5)

    }
  // funciona con el token
    @Get(':id')
    @ApiOperation({ summary: ' Get User By Id' })
    // @ApiBearerAuth()
    // @Roles(Role.Admin)
    // @UseGuards(AuthGuard, RolesGuard)
    
    getUserById(@Param("id", ParseUUIDPipe) id: string) {
        return this.usersService.getByID(id);

    }
    
    @Delete(':id')
    @ApiOperation({ summary: ' Delete User By Id' })
    @ApiBearerAuth()
    @Roles(Role.Admin) // super Admin
    @UseGuards(AuthGuard, RolesGuard)
    DeleteId(@Param("id") id: string) {
        return this.usersService.deleteUser(id);

    }

    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: ' Update User By Id' })
    @UseGuards(AuthGuard)
    @Roles(Role.SAdmin) // super Admin
    async updateUser(@Param('id') id: string, @Body() user: Users): Promise<Partial<Users>> {

        return this.usersService.updateUser(id, user)
    }


    @Get(':email')
    @ApiOperation({ summary: ' Get User By Email' })
    async getUserByEmail(@Param('email') email: string): Promise<Partial<Users>> {
        const user = await this.usersService.getByemail(email);
        if (!user) {
            throw new NotFoundException('User  not found');
        }
        return user;
    }

}
