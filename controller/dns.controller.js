const { dnsService } = require("../services");
const { createError } = require("../utils/error");
const fs = require("fs");
const csv = require("csv-parser");

const getDomains = async (req, res, next) => {
  try {
    const domains = await dnsService.getDomains();
    res.status(200).json(domains);
  } catch (error) {
    next(error);
  }
};

const getDomainDetails = async (req, res, next) => {
  try {
    const hostedZoneId = req.params.id;
    const domainDetails = await dnsService.getDomainDetails(hostedZoneId);
    res.status(200).json(domainDetails);
  } catch (error) {
    next(error);
  }
};

const createDomain = async (req, res, next) => {
  try {
    const domain = await dnsService.createDomain(req.body);
    res.status(200).json(domain);
  } catch (error) {
    next(error);
  }
};

const updateDomain = async (req, res, next) => {
  try {
    const hostedZoneId = req.params.id;
    const data = await dnsService.updateDomain(hostedZoneId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteDomain = async (req, res, next) => {
  try {
    const hostedZoneId = req.params.id;
    const data = await dnsService.deleteDomain(hostedZoneId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getDnsRecords = async (req, res, next) => {
  const domainId = req.params.domainId;
  try {
    const records = await dnsService.getDnsRecords(domainId);
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

const createDNSRecord = async (req, res, next) => {
  const domainId = req.params.domainId;
  try {
    const record = await dnsService.createDNSRecord(req.body, domainId);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

const editDNSRecord = async (req, res, next) => {
  try {
    const domainId = req.params.domainId;
    const record = await dnsService.editDNSRecord(req.body, domainId);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

const deleteDNSRecord = async (req, res, next) => {
  try {
    const domainId = req.params.domainId;
    const record = await dnsService.deleteDNSRecord(domainId, req.body);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

const getDnsRecordById = async (req, res, next) => {
  const domainId = req.params.domainId;
  const recordId = req.params.recordId;
  try {
    const data = await dnsService.getDnsRecordById(domainId, recordId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const uploadBulkDomainData = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, "No file provided"));
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    if (fileExtension !== "json") {
      return next(
        createError(400, "Invalid file format. Please upload a JSON file")
      );
    }

    const domains = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));

    fs.unlinkSync(req.file.path);
    domains.forEach(async (domain) => {
      await dnsService.createDomain(domain);
    });

    res.status(200).json({ message: "Domain data uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

const uploadBulkDNSRecordData = async (req, res, next) => {
  const domainId = req.params.id
  try {
    if (!req.file) {
      return next(createError(400, "No file provided"));
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    if (fileExtension !== "json") {
      return next(
        createError(400, "Invalid file format. Please upload a JSON file")
      );
    }
    const domains = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));

    fs.unlinkSync(req.file.path);
    const promises = []
    domains.forEach(async (domain) => { 
      promises.push(dnsService.createDNSRecord(domain, domainId))
    });
    await Promise.all(promises)
    res.status(200).json({ message: "Domain data uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDomains,
  getDomainDetails,
  createDomain,
  updateDomain,
  deleteDomain,
  getDnsRecords,
  createDNSRecord,
  getDnsRecordById,
  editDNSRecord,
  deleteDNSRecord,
  uploadBulkDomainData,
  uploadBulkDNSRecordData,
};
