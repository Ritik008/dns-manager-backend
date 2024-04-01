const Joi = require('joi')

const allowedTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'SRV', 'TXT', 'DNSSEC'];


const domainSchema = {
    domainPost: Joi.object().keys({
        name: Joi.string().required(),
        comment: Joi.string().allow("").optional()
    }),
    domainUpdate: Joi.object().keys({
        comment: Joi.string(),
    })
}

const dnsSchema = {
    dnsPost: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required().allow(...allowedTypes),
        values: Joi.array().items(Joi.string()).required(),
        ttl: Joi.string().required()
    }),
    dnsEdit: Joi.object().keys({
        name: Joi.string(),
        type: Joi.string().allow(...allowedTypes),
        values: Joi.array().items(Joi.string()),
        ttl: Joi.string()
    }),
    dnsDelete: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required(...allowedTypes),
        ttl: Joi.string().required(),
        values: Joi.array().items(Joi.string()),
    })
}

module.exports = {
    domainSchema,
    dnsSchema
}