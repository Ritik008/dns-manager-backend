const {dnsService} = require('../services');
const { createError } = require('../utils/error');

const getDns = async (req, res, next) => {
  try {
    const hostedZones = await dnsService.getDns();
    res.json(hostedZones);
  } catch (error) {
    next(error)
  }
}

const createDns = async (req, res, next) => {
  const { name, type, value, ttl } = req.body;
  try {
    const hostedZone = await dnsService.createDns({ name, type, value, ttl });
    res.json(hostedZone);
  } catch (error) {
    next(error)
  }
}


const editDns = async (req, res, next) => {
  const { recordName, recordType, value, ttl } = req.body
  try {
    const hostedZone = await dnsService.editDns({ recordName, recordType, value, ttl})
    res.json(hostedZone)
  }catch(error) {
    next(error)
  }
}

const deleteDns = async (req, res, next) => {
  const {recordName, recordType, ttl, value} = req.body
  try {
    const deletedDns = await dnsService.deleteDns({recordName, recordType, ttl, value})
    res.json(deletedDns)
  }catch(error) {
    next(error)
  }
}



module.exports = {
  getDns,
  createDns,
  editDns,
  deleteDns
};