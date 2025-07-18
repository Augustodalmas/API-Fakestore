const Joi = require("joi");

const validationUser = Joi.object({
    title: {
        title_pt: Joi.string().min(3).required(),
        title_en: Joi.string().min(3).required(),
        title_es: Joi.string().min(3).required(),
    },
    price: Joi.number().required(),
    description: {
        description_pt: Joi.string().min(10).max(600).required(),
        description_en: Joi.string().min(10).max(600).required(),
        description_es: Joi.string().min(10).max(600).required(),
    },
    imagem: Joi.array(),
    category: Joi.required(),
    rating: {
        rate: Joi.number(),
        count: Joi.number().integer()
    }
})

module.exports = validationUser