const Joi = require('joi')

const domainSchema = {
    domainPost: Joi.object().keys({
        name: Joi.string().required(),
        comment: Joi.string().optional()
    }),
    domainUpdate: Joi.object().keys({
        comment: Joi.string(),
    })
}

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

module.exports = {
    domainSchema,
    dnsSchema
}