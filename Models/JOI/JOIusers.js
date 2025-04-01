const joi = require('joi')

const validation = joi.object({
    username: joi.string().min(3).required(),
    name: joi.string().required(),
    password1: joi.string()
        .pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1)){8,}$')).min(8).required(),
    password2: joi.ref("password1"),
    vendedor: joi.required()
})

module.exports = validation