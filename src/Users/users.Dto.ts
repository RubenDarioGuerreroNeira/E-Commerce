/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail, Matches, IsNumber, Validate, IsEmpty } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger'
import { MatchPasword } from 'src/Decorators/matchPassword.decorator';
export class UserDto {
   @IsNotEmpty()
   @IsString()
   @MinLength(3)
   @MaxLength(50)
   @ApiProperty({
      description: "The UserName must be amount of 3 to 50 characters long",
      example: "rub851"
   })
   name: string;

   @IsNotEmpty()
   @IsEmail()
   @ApiProperty({
      description: "Type here email by user",
      example: "demo14@hotmail.com"
   })

   email: string;

   @IsNotEmpty()
   @IsString()
   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@%$&*])/, {
      message: 'Password must contain at least one Uppercase Letter, one Special Character, and one number.'
   })
   @MaxLength(15)
   @MinLength(8)
   @ApiProperty({
      description: "The password must be amount of 8 to 15 characters long",
      example: "PassWD*01,"
   })
   password: string;

   @IsEmpty()
   isAdmin?: boolean;

   @IsNotEmpty()
   @Validate(MatchPasword, ['password'])
   confirmPassword: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(80)
   @MinLength(3)
   @ApiProperty({
      description: "Address must be amount of 3 to 80 characters long",
      example: "Street 45, 2B"
   })
   address: string;

   @IsNotEmpty()
   @IsNumber()
   @ApiProperty({ description: "Phone must be amount of 9 numbers", example: "57252158" })
   phone: number;

   @IsNotEmpty()
   @IsString()
   @MinLength(5)
   @MaxLength(20)
   @ApiProperty()
   country: string;

   @IsNotEmpty()
   @IsString()
   @MinLength(5)
   @MaxLength(20)
   @ApiProperty()
   city: string;
}
export class LoginUserDto extends PickType(UserDto, ['email', 'password']) { }

