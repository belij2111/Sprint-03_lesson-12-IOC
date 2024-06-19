import {ResultStatus} from "./result-code";

export type Result<T = null> = {
    status: ResultStatus,
    extensions?: [{ field: string, message: string }],
    data: T
}