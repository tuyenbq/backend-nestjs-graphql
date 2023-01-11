export const REGISTER_ERRORS = {
  EMAIL_ALREADY_IN_USE: {
    code: 'EMAIL_ALREADY_IN_USE',
    message: 'email already in use',
  },
  /**
   * Joi error message => no need error code
   */
  FIELD_PASSWORD_LENGTH_MUST_6: {
    message: '"password" length must be at least 6 characters long',
  },
  FIELD_NOT_VALID_EMAIL: {
    message: '"email" must be a valid email',
  },
  FIELD_CONFIRM_PASSWORD_MUST_MATCH: {
    message: 'Confirm password must match',
  },
};
export const AUTHENTICATION_ERRORS = {
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Access is denied due to invalid credentials',
  },
  USER_NOT_EXISTS: {
    code: 'USER_NOT_EXISTS',
    message: 'User is not existed',
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Token is expired',
  },
  INVALID_ACCOUNT: {
    code: 'INVALID_ACCOUNT',
    message: 'Invalid account',
  },
};

export const USER_ERRORS = {
  EMAIL_NOT_FOUND: {
    code: 'EMAIL_NOT_FOUND',
    message: 'Email not found',
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    message: 'Wrong password',
  },
};
