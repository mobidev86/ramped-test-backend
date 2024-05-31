import { errorIncorrectPassword, errorInvalidUserEmail, errorSomethingWentWrong, errorUserAlreadyExists, successUserCreated, successUserLoggedIn } from "../../globals/constants";
import { generateToken, hashPassword, matchPassword } from "../../globals/crypt.service";
import { prepareAndValidateObject, sendErrorResponse, sendSuccessResponse } from "../../globals/error.handler";
import User, { IUser, IUserLogin } from "../../models/user";
import { LoginDTO, SignupDTO } from "./user.dto";


export class UserService {
    constructor() { }
    //#region  user register function
    async funUserRegister(body: IUser) {

        try {
            const modifiedPayload: any = await prepareAndValidateObject(body, SignupDTO);
            console.log({ body, modifiedPayload })
            if (modifiedPayload.message == "VALIDATIONS_ERROR")
                return sendErrorResponse(modifiedPayload.message, 400, modifiedPayload?.error)
            const { email, password, preference } = modifiedPayload;
            // Check if user already exists
            let user = await User.findOne({ email }).select(['_id', 'email']);
            if (user)
                return sendErrorResponse(errorUserAlreadyExists, 400)
            // Create new user
            user = new User({
                email,
                password,
                preference,
            });
            // Encrypt password
            user.password = await hashPassword(password);
            //save user object
            await user.save();
            return sendSuccessResponse(successUserCreated, 201);
        } catch (err) {
            return sendErrorResponse(errorSomethingWentWrong, 500, err)

        }
    }
    //#endregion

    //#region  user login function
    async funUserLogin(body: IUserLogin) {
        try {
            const modifiedPayload: any = await prepareAndValidateObject(body, LoginDTO);
            if (modifiedPayload.message == "VALIDATIONS_ERROR")
                return sendErrorResponse(modifiedPayload.message, 400, modifiedPayload?.error)
            const { email, password } = modifiedPayload;
            // Check if user exists
            const user = await User.findOne({ email }).select(['_id', 'email', 'password']);
            if (!user)
                return sendErrorResponse(errorInvalidUserEmail, 400)
            // Check if password is correct
            const isMatch = await matchPassword(password, user.password);
            if (!isMatch)
                return sendErrorResponse(errorIncorrectPassword, 400)
            // Generate JWT token
            const payload = {
                id: user._id,
                email: user.email
            };
            const token = generateToken(payload)
            return sendSuccessResponse(successUserLoggedIn, 201, { ...payload, token });
        } catch (err) {
            return sendErrorResponse(errorSomethingWentWrong, 500, err)
        }
    }
    //#endregion



}