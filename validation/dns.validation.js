const Joi = require('joi')

const dnsSchema = {
    dnsPost: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required(),
        value: Joi.string().required(),
        ttl: Joi.string().required()
    }),
    dnsEdit: Joi.object().keys({
        recordName: Joi.string().required(),
        recordType: Joi.string().required(),
        value: Joi.string(),
        ttl: Joi.string()
    }),
    dnsDelete: Joi.object().keys({
        recordName: Joi.string().required(),
        recordType: Joi.string().required(),
        ttl: Joi.string().required(),
        value: Joi.string().required(),
    })
}

module.exports = dnsSchema