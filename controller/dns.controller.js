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

const getDnsRecords = async (req, res, next) => {
  const domainId = req.params.domainId;
  try {
    const records = await dnsService.getDnsRecords(domainId);
    res.json(records);
  } catch (error) {
    next(error)
  }
}

const getDnsRecordById = async (req, res, next) => {
  const domainId = req.params.domainId;
  const recordId = req.params.recordId;
  try {
    const data = await dnsService.getDnsRecordById(domainId, recordId)
    res.json(data)
  }catch(error) {
    next(error)
  }
}



module.exports = {
  getDomains,
  getDomainDetails,
  createDomain,
  updateDomain,
  deleteDomain,
  getDnsRecords,
  getDnsRecordById
};