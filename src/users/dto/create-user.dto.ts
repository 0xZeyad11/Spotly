import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsEnum(['REGULAR', 'FAMOUS'])
    user_type: "REGULAR" | "FAMOUS";
}
