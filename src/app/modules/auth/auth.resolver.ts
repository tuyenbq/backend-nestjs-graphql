import { UseGuards, UsePipes } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '../../../vendors/base/base.resolver';
import {
  LoginResponse,
  MutationResponse,
  AddUserInput,
} from '../../graphql/graphql.schema';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenQueryResponse } from './dto/auth.dto';
import * as joi from 'joi';
import { JoiValidationPipe } from '../../../vendors/pipes/joiValidation.pipe';
import { GRANT_TYPE, TOKEN_TYPE } from '../../../configs/constants/auth';
import { KeyAuthGuard } from '../../../vendors/guards/auth.guard';

@Resolver()
export class AuthResolver extends BaseResolver {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Query login: get token to authentication and authorization for user
   * @param loginInput: email, password, grantType
   * @returns
   */
  @UsePipes(
    new JoiValidationPipe<LoginDto>({
      email: joi.string().email({ tlds: { allow: false } }),
      password: joi.string().min(6).max(255),
      grantType: joi.string().valid(GRANT_TYPE).default(GRANT_TYPE),
    }),
  )
  @Query('login')
  async login(@Args('input') loginInput: LoginDto): Promise<LoginResponse> {
    const { accessToken, refreshToken } = await this.authService.login(
      loginInput,
    );
    return this.response({
      accessToken,
      refreshToken,
      tokenType: TOKEN_TYPE,
    });
  }

  /**
   * Query refreshToken: get new access token by refresh token without password
   * @param refreshToken
   * @returns
   */
  @Query('refreshToken')
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<RefreshTokenQueryResponse> {
    const { accessToken, expiredAt } = await this.authService.refreshToken(
      refreshToken,
    );
    return this.response({ accessToken, expiredAt });
  }

  /**
   * Mutation addUser: add new user by admin
   * @param addUserInput
   * @returns
   */
  @UsePipes(
    new JoiValidationPipe<AddUserInput>({
      email: joi.string().email({ tlds: { allow: false } }),
      password: joi
        .string()
        .min(6)
        .max(255)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        .message('Wrong password format'),
    }),
  )
  @UseGuards(KeyAuthGuard)
  @Mutation('addUser')
  async addUser(
    @Args('input') addUserInput: AddUserInput,
  ): Promise<MutationResponse> {
    if (await this.authService.addUser(addUserInput)) {
      return this.response('success!');
    }
    return this.response('fail!');
  }
}
