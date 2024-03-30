const { dnsController } = require("../controller");
const validator = require("../middleware/validation");
const { dnsPost, dnsEdit } = require("../validation/dns.validation");
const router = require("express").Router();

router.get("/", dnsController.getDns);

router.post("/",validator(dnsPost), dnsController.createDns);

router.put("/", validator(dnsEdit), dnsController.editDns);

router.delete("/", dnsController.deleteDns);

module.exports = router;
