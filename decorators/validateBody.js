import { HttpError } from "../helpers/index.js";

const validateBody = schema => {
    const func = (req, res, next)=> {

        const {error} = schema.validate(req.body);
        console.log(schema.validate(req.body));
        if(error) {
            // error.message = "missing required name field"
            return next(HttpError(400, error.message));
        }
        next();
    }

    return func;
}

export default validateBody;