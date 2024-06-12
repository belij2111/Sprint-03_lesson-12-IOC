export interface OutputUserType {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export interface InputUserType {
    login: string,
    password: string,
    email: string
}