import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
  ){

  }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password , ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password , 10)
      });
      await this.userRepository.save(user)
      delete user.password;
      return user;
      //TODO : Retornar el Json Web Token
    } catch (error) {
      this.handleDBErrors(error)
    };
  }

  async login(loginUserDto:LoginUserDto){
    const { password , email} = loginUserDto;
    const user = await this.userRepository.findOne({
      where:{ email},
      select:{email:true, password:true}
    });
    if(!user){
      throw new UnauthorizedException('Credentials are not valid (Mail)')
    }
    if (!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid (Password)')
    }
    //console.log(bcrypt.compareSync(password, user.password))
    return user;

  }

  private handleDBErrors(error:any):never{
    if(error.code === "23505"){
      throw new BadRequestException(`Your error is ${error.detail}`);
    }

    console.log(error)

    throw new InternalServerErrorException("Check the console");
  }
  
  
}
