const {dnsService} = require('../services');

const getDns = async (req, res, next) => {
  try {
    const hostedZones = await dnsService.getDns();
    res.json(hostedZones);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const createDns = async (req, res) => {
  const { name, type, value, ttl } = req.body;
  try {
    const hostedZone = await dnsService.createDns({ name, type, value, ttl });
    res.json(hostedZone);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
}


const editDns = async (req, res) => {
  const { recordName, recordType, value, ttl } = req.body
  try {
    const hostedZone = await dnsService.editDns({ recordName, recordType, value, ttl})
    res.json(hostedZone)
  }catch(error) {
    console.log(error)
    res.status(500).json({message: "Internal server error"})
  }
}

const deleteDns = async (req, res) => {
  const {recordName, recordType, ttl, value} = req.body
  try {
    const deletedDns = await dnsService.deleteDns({recordName, recordType, ttl, value})
    res.json(deletedDns)
  }catch(error) {
    console.log(error)
    res.status(500).json({message: "Internal server error"})
  }
}

module.exports = {
  getDns,
  createDns,
  editDns,
  deleteDns
};