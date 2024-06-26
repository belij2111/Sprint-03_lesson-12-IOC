export interface LoginInputType {
    loginOrEmail: string,
    password: string
}

export interface LoginSuccessOutputType {
    accessToken: string
}

export interface MeOutputType {
    email: string,
    login: string,
    userId: string
}