export interface LoginInputType {
    loginOrEmail: string,
    password: string
}

export interface LoginServiceOutputType {
    accessToken: string,
    refreshToken: string
}

export interface MeOutputType {
    email: string,
    login: string,
    userId: string
}

export interface RegistrationConfirmationCodeInputType {
    code: string
}

export interface RegistrationEmailResendingInputType {
    email: string
}

export interface ApiCallDataInputType {
    ip: string,
    url: string
}

export interface PasswordRecoveryInputType {
    email: string
}

export interface NewPasswordInputType {
    newPassword: string,
    recoveryCode: string
}