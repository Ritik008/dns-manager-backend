const { dnsController } = require("../controller");
const validator = require("../middleware/validation");
const { dnsValidation } = require("../validation");
const router = require("express").Router();

router.get('/domains', dnsController.getDomains)

router.get('/domains/:id', dnsController.getDomainDetails)

router.post('/domains', validator(dnsValidation.domainSchema.domainPost), dnsController.createDomain)

router.put('/domains/:id', validator(dnsValidation.domainSchema.domainUpdate), dnsController.updateDomain)

router.delete('/domains/:id', dnsController.deleteDomain)

router.get("/domains/:domainId/records", dnsController.getDnsRecords);

router.get('/domains/:domainId/records/:recordId', dnsController.getDnsRecordById);

router.post('/domains/:domainId/records', validator(dnsValidation.dnsSchema.dnsPost), dnsController.createDNSRecord)

router.put('/domains/:domainId/records', validator(dnsValidation.dnsSchema.dnsEdit), dnsController.editDNSRecord)

router.delete('/domains/:domainId/records', validator(dnsValidation.dnsSchema.dnsDelete), dnsController.deleteDNSRecord)

module.exports = router;
