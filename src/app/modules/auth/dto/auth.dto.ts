import { LoginInput } from '../../../graphql/graphql.schema';
export class LoginDto implements LoginInput {
  email: string;
  password: string;
  grantType: string;
}

export class ChangePasswordDto {
  password: string;
  newPassword: string;
}

export class RefreshTokenQueryResponse {
  statusCode: number;
  message: string;
  data: AcceessToken;
}

export class ChangePasswordResponse {
  statusCode: number;
  message: string;
  data: ChangePassword;
}

export class ChangePassword {
  userId: number;
}

export class LoginResponse {
  accessToken: AcceessToken;
  refreshToken: RefreshToken;
}

export class AcceessToken {
  accessToken: string;
  expiredAt: number;
}

export class RefreshToken {
  refreshToken: string;
  expiredAt: number;
}

export class LogoutResponse {
  statusCode: number;
  message: string;
  data: Logout;
}

export class Logout {
  userId: number;
}
