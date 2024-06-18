import {ResultStatus} from "./result-code";

export type Result<T = null> = {
    status: ResultStatus,
    extensions?: [{ field: '', message: '' }],
    data: T
}