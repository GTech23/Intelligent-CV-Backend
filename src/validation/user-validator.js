import Joi from 'joi';

const userSchema = Joi.object({
    username: Joi.string().required().min(5).max(10).trim(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().required().trim().min(8)
})


export default userSchema;