const AWS = require("aws-sdk");
const ApiError = require("../utils/ApiError");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const route53 = new AWS.Route53();

const getDomains = async () => {
  try {
    const data = await route53.listHostedZones({}).promise();
    const domains = data.HostedZones;
    return domains;
  } catch (error) {
    throw error;
  }
};

const getDomainDetails = async (hostedZoneId) => {
  try {
    const params = {
      Id: `/hostedzone/${hostedZoneId}`,
    };
    const data = await route53.getHostedZone(params).promise();
    if (!data) {
      throw new ApiError(404, "Domain not found");
    }
    const domain = {
      id: data.HostedZone.Id.split("/").pop(),
      name: data.HostedZone.Name.replace(/\.$/, ""),
      comment: data.HostedZone.Config && data.HostedZone.Config.Comment,
      resourceRecordSetCount: data.HostedZone.ResourceRecordSetCount,
      nameServers: data.DelegationSet.NameServers,
    };

    return domain;
  } catch (error) {
    throw error;
  }
};

const createDomain = async (domainBody) => {
  const params = {
    Name: domainBody.name,
    CallerReference: `${Date.now()}`,

    HostedZoneConfig: {
      Comment: domainBody.comment,
    },
  };
  const data = await route53.createHostedZone(params).promise();
  const domain = {
    id: data.HostedZone.Id.split("/").pop(),
    name: data.HostedZone.Name.replace(/\.$/, ""),
    comment: data.HostedZone.Config && data.HostedZone.Config.Comment,
  };
  return domain;
};

const updateDomain = async (hostedZoneId, domainBody) => {
  const params = {
    Id: `/hostedzone/${hostedZoneId}`,
    Comment: domainBody.comment,
  };
  const domain = await getDomainDetails(hostedZoneId);
  if (!domain) {
    throw new ApiError(404, "Domain with this hosted zone id not found");
  }
  await route53.updateHostedZoneComment(params).promise();
  return "update successful";
};

const deleteDomain = async (hostedZoneId) => {
  const domain = await getDomainDetails(hostedZoneId);
  if (!domain) {
    throw new ApiError(404, "Domain with this hosted zone id not found");
  }
  const params = {
    Id: `/hostedzone/${hostedZoneId}`,
  };
  await route53.deleteHostedZone(params).promise();
  return "delete successful";
};

const getDnsRecords = async (domainId) => {
  try {
    const params = {
      HostedZoneId: domainId,
    };
    const data = await route53.listResourceRecordSets(params).promise();

    const records = data.ResourceRecordSets.map((recordSet) => {
      return {
        name: recordSet.Name.replace(/\.$/, ""),
        type: recordSet.Type,
        ttl: recordSet.TTL,
        values: recordSet.ResourceRecords.map((record) => record.Value),
      };
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const getDnsRecordById = async (domainId, recordId) => {
  const params = {
    HostedZoneId: domainId,
  };
  const data = await route53.listResourceRecordSets(params).promise();
  const record = data.ResourceRecordSets.find(
    (recordSet) => recordSet.Name.replace(/\.$/, '') === recordId
  );

  if (!record) {
    throw new ApiError(404, 'DNS record not found')
  }

  const dnsRecord = {
    name: record.Name.replace(/\.$/, ""),
    type: record.Type,
    ttl: record.TTL,
    values: record.ResourceRecords.map((record) => record.Value),
  };
  return dnsRecord;
};

const createDNSRecord = async (domainBody, domainId) => {
  const params = {
    HostedZoneId: domainId,
    ChangeBatch: {
      Changes: [{
        Action: 'CREATE',
        ResourceRecordSet: {
          Name: domainBody.name,
          Type: domainBody.type,
          TTL: domainBody.ttl,
          ResourceRecords: domainBody.values.map(value => ({ Value: value }))
        }
      }]
    }
  };
  const data = await route53.changeResourceRecordSets(params).promise();
  return data
}

const editDNSRecord = async (domainBody, domainId) => {
  const params = {
    HostedZoneId: domainId,
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: domainBody.name,
          Type: domainBody.type,
          TTL: domainBody.ttl,
          ResourceRecords: domainBody.values.map(value => ({ Value: value }))
        }
      }]
    }
  };
  const data = await route53.changeResourceRecordSets(params).promise();
  return data
}

const deleteDNSRecord = async (domainId, domainBody) => {
  const params = {
    HostedZoneId: domainId,
    ChangeBatch: {
      Changes: [{
        Action: 'DELETE',
        ResourceRecordSet: {
          Name: domainBody.name,
          Type: domainBody.type,
          TTL: domainBody.ttl,
          ResourceRecords: domainBody.values.map(value => ({ Value: value }))
        }
      }]
    }
  };
  await route53.changeResourceRecordSets(params).promise();
  return 'dns deleted'
}


module.exports = {
  getDomains,
  getDomainDetails,
  createDomain,
  updateDomain,
  deleteDomain,
  getDnsRecords,
  getDnsRecordById,
  createDNSRecord,
  editDNSRecord,
  deleteDNSRecord
};
