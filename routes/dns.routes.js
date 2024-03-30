const { dnsController } = require("../controller");
const validator = require("../middleware/validation");
const { dnsValidation } = require("../validation");
const router = require("express").Router();

router.get('/domains', dnsController.getDomains)

router.get('/domains/:id', dnsController.getDomainDetails)

router.post('/domains', validator(dnsValidation.domainSchema.domainPost), dnsController.createDomain)

router.put('/domains/:id', validator(dnsValidation.domainSchema.domainUpdate), dnsController.updateDomain)

router.delete('/domains/:id', dnsController.deleteDomain)

router.get("/", dnsController.getDns);

router.post("/",validator(dnsValidation.dnsSchema.dnsPost), dnsController.createDns);

router.put("/", validator(dnsValidation.dnsSchema.dnsEdit), dnsController.editDns);

router.delete("/", dnsController.deleteDns);

module.exports = router;
