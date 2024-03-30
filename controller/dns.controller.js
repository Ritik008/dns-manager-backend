const {dnsService} = require('../services');
const { createError } = require('../utils/error');

const getDomains = async (req, res, next) => {
  try {
    const domains = await dnsService.getDomains()
    res.status(200).json(domains)
  }catch(error) {
    next(error)
  }
}

const getDomainDetails = async (req, res, next) => {
  try {
    const hostedZoneId = req.params.id;
    const domainDetails = await dnsService.getDomainDetails(hostedZoneId)
    res.status(200).json(domainDetails)
  }catch(error) {
    next(error)
  }
}

const createDomain = async (req, res, next) => {
  try {
    const domain = await dnsService.createDomain(req.body)
    res.status(200).json(domain)
  }catch(error) {
    next(error)
  }
}

const updateDomain = async (req, res, next) => {
  try {
    const hostedZoneId = req.params.id
    const data = await dnsService.updateDomain(hostedZoneId, req.body)
    res.status(200).json(data)
  }catch(error) {
    next(error)
  }
}

const deleteDomain = async (req, res, next) => {
  try {
    const hostedZoneId = req.params.id
    const data = await dnsService.deleteDomain(hostedZoneId)
    res.status(200).json(data)
  }catch(error) {
    next(error)
  }
}

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
  getDomains,
  getDomainDetails,
  createDomain,
  updateDomain,
  getDns,
  createDns,
  editDns,
  deleteDns,
  deleteDomain
};