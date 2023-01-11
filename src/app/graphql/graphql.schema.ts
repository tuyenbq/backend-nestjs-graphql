
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface LoginInput {
    email: string;
    password: string;
    grantType?: Nullable<string>;
}

export interface AddUserInput {
    email: string;
    password: string;
}

export interface IQuery {
    login(input: LoginInput): Nullable<LoginResponse> | Promise<Nullable<LoginResponse>>;
    logout(): Nullable<LogoutResponse> | Promise<Nullable<LogoutResponse>>;
    refreshToken(refreshToken?: Nullable<string>): Nullable<RefreshTokenQueryResponse> | Promise<Nullable<RefreshTokenQueryResponse>>;
}

export interface LoginResponse {
    statusCode: number;
    data?: Nullable<Login>;
    error?: Nullable<Error>;
}

export interface Login {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    tokenType: string;
}

export interface RefreshTokenQueryResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<AccessToken>;
    error?: Nullable<Error>;
}

export interface IMutation {
    addUser(input: AddUserInput): Nullable<MutationResponse> | Promise<Nullable<MutationResponse>>;
}

export interface AccessToken {
    accessToken?: Nullable<string>;
    expiredAt?: Nullable<number>;
}

export interface RefreshToken {
    refreshToken?: Nullable<string>;
    expiredAt?: Nullable<number>;
}

export interface LogoutResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    error?: Nullable<Error>;
    data?: Nullable<Logout>;
}

export interface Logout {
    userId?: Nullable<number>;
}

export interface Error {
    errorCode: string;
    message?: Nullable<string>;
    details: Nullable<ErrorDetail>[];
}

export interface ErrorDetail {
    message?: Nullable<string>;
    type?: Nullable<string>;
    key?: Nullable<string>;
    value?: Nullable<string>;
}

export interface PagerInformation {
    pageTotal?: Nullable<number>;
    totalCount?: Nullable<number>;
    currentPage?: Nullable<number>;
    pageSize?: Nullable<number>;
}

export interface MutationResponse {
    statusCode: number;
    data?: Nullable<string>;
    error?: Nullable<Error>;
}

export type JSON = any;
type Nullable<T> = T | null;
