const { dnsController } = require("../controller");
const { auth } = require("../middleware/auth");
const validator = require("../middleware/validation");
const { dnsValidation } = require("../validation");
const multer = require('multer')
const router = require("express").Router();

// const upload = multer({ dest: 'uploads/' });



router.get('/domains',  dnsController.getDomains)

router.get('/domains/:id',  dnsController.getDomainDetails)

router.post('/domains',  validator(dnsValidation.domainSchema.domainPost), dnsController.createDomain)

router.put('/domains/:id', validator(dnsValidation.domainSchema.domainUpdate), dnsController.updateDomain)

router.delete('/domains/:id',  dnsController.deleteDomain)

router.get("/domains/:domainId/records", dnsController.getDnsRecords);

router.get('/domains/:domainId/records/:recordId',  dnsController.getDnsRecordById);

router.post('/domains/:domainId/records',  validator(dnsValidation.dnsSchema.dnsPost), dnsController.createDNSRecord)

router.put('/domains/:domainId/records',  validator(dnsValidation.dnsSchema.dnsEdit), dnsController.editDNSRecord)

router.delete('/domains/:domainId/records',  validator(dnsValidation.dnsSchema.dnsDelete), dnsController.deleteDNSRecord)

// The code works fine locally but encounters issues when deployed to Vercel.

// router.post('/domains/upload',  upload.single('file'), dnsController.uploadBulkDomainData)

// router.post('/domains/:id/record/upload',  upload.single('file'), dnsController.uploadBulkDNSRecordData)

module.exports = router;
