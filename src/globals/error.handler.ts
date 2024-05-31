import { validate } from "class-validator"

export const sendErrorResponse = (message: null | string = null, statusCode: number, error: any = null) => {
    return {
        message: message ?? "Something went to wrong",
        valid: false,
        statusCode: statusCode,
        error: error ?? undefined
    }
}
export const sendSuccessResponse = (message: null | string = null, statusCode: number, data: any = null) => {
    return {
        message: message ?? "Success",
        valid: true,
        statusCode: statusCode,
        data: data ?? undefined
    }
}

export const prepareAndValidateObject = async (payload: any, Validator: any) => {
    const validation = new Validator()
    payload = typeof payload == 'object' ? payload : {}
    for (let key in payload) {
        validation[key] = payload[key]
    }
    const errors = await validate(validation);
    if (errors.length) {
        const errorsInfo: any[] = errors.map(error => ({
            property: error.property,
            constraints: error.constraints,
        }));
        return { message: 'VALIDATIONS_ERROR', error: errorsInfo }
    }
    return validation

}