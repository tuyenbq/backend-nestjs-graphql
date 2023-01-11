import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput, AddUserInput } from '../../graphql/graphql.schema';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { AcceessToken } from './dto/auth.dto';
import * as moment from 'moment';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { User } from './entities/user.entity';
import {
  AUTHENTICATION_ERRORS,
  REGISTER_ERRORS,
  USER_ERRORS,
} from '../../../configs/constants/error-code/auth';
import { Repository } from 'typeorm';
import { SALT_ROUNDS } from '../../../configs/constants/auth';

/**
 * all functions about authentication and authorization
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private adminRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  /**
   * verify email and password is correct and return user infomation
   * @param email
   * @param password
   * @returns
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BaseException(
        USER_ERRORS.EMAIL_NOT_FOUND.code,
        USER_ERRORS.EMAIL_NOT_FOUND.message,
      );
    }
    // compare encode password with old password
    const passwordMatched = bcrypt.compareSync(password, user.password);
    if (passwordMatched) {
      return { email: user.email, id: user.id };
    }
    throw new BaseException(
      USER_ERRORS.WRONG_PASSWORD.code,
      USER_ERRORS.WRONG_PASSWORD.message,
    );
  }

  /**
   * login user: get access token and fresh token by email and password
   * - and save refresh token to databsae
   * @param user email, password
   * @returns
   */
  async login(user: LoginInput) {
    const userDb = await this.validateUser(user.email, user.password);
    const payloadToken = {
      email: userDb.email,
      userId: userDb.id,
    };
    const accessToken = this.getAccessToken(payloadToken);
    const refreshToken = this.getRefreshToken(payloadToken);
    const token = new Token();
    token.refreshToken = refreshToken.refreshToken;
    token.expiredAt = moment(refreshToken.expiredAt * 1000).toDate();
    token.user = userDb;
    await this.tokenRepository.save(token);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * generate token by user info and access token setting
   * @param payload
   * @returns
   */
  getAccessToken(payload) {
    const options = {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    };
    const accessToken = this.jwtService.sign(payload, options);
    const verify = this.jwtService.verify(accessToken, options);
    return {
      accessToken,
      expiredAt: verify.exp,
    };
  }

  /**
   * generate token by user info and refresh token setting
   * @param payload
   * @returns
   */
  getRefreshToken(payload) {
    const options = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
    };
    const refreshToken = this.jwtService.sign(payload, options);
    const verify = this.jwtService.verify(refreshToken, options);
    return {
      refreshToken,
      expiredAt: verify.exp,
    };
  }

  /**
   * verify refresh token and user information to generate new access token
   * @param refreshToken
   * @returns
   */
  async refreshToken(refreshToken: string): Promise<AcceessToken> {
    const token = await this.findToken(refreshToken);
    if (!token) {
      throw new BaseException(
        AUTHENTICATION_ERRORS.TOKEN_INVALID.code,
        AUTHENTICATION_ERRORS.TOKEN_INVALID.message,
        null,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!token.user) {
      throw new BaseException(
        AUTHENTICATION_ERRORS.USER_NOT_EXISTS.code,
        AUTHENTICATION_ERRORS.USER_NOT_EXISTS.message,
        null,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (token.expiredAt < moment().toDate()) {
      throw new BaseException(
        AUTHENTICATION_ERRORS.TOKEN_EXPIRED.code,
        AUTHENTICATION_ERRORS.TOKEN_EXPIRED.message,
        null,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payloadToken = {
      email: token.user.email,
      userId: token.user.id,
    };
    const accessToken = this.getAccessToken(payloadToken);
    return accessToken;
  }

  /**
   * remove fresh token to make sure user can not genate new access token without password
   * @param userId
   * @returns
   */
  async logout(userId: any) {
    return this.tokenRepository
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where('user_id = :id', { id: userId })
      .execute();
  }

  /**
   * encode password
   * @param password
   * @returns
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Add new user to system by email and passsword
   * - If the email already exists, it cannot be added
   * @param createUserInput
   * @returns
   */
  async addUser(createUserInput: AddUserInput) {
    const user = await this.findByEmail(createUserInput.email);
    if (user) {
      throw new BaseException(
        REGISTER_ERRORS.EMAIL_ALREADY_IN_USE.code,
        REGISTER_ERRORS.EMAIL_ALREADY_IN_USE.message,
      );
    }
    const newUser = new User();
    newUser.email = createUserInput.email;
    // encode password before save
    newUser.password = await this.hashPassword(createUserInput.password);
    return await this.adminRepository.save(newUser);
  }

  /**
   * find user by email
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<User> {
    return await this.adminRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * find user by token
   * @param refreshToken
   * @returns
   */
  async findToken(refreshToken: string): Promise<Token> {
    return await this.tokenRepository.findOne({
      where: {
        refreshToken,
      },
      relations: ['user'],
    });
  }
}
