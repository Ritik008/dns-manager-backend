const AWS = require("aws-sdk");
const ApiError = require("../utils/ApiError");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const route53 = new AWS.Route53();
const hostedZoneId = "Z04391383RRGTNPDDFACG";

const getDomains = async () => {
    try {
      const data = await route53.listHostedZones({}).promise();
      const domains = data.HostedZones
      return domains
    }catch(error) {
      throw error
    }
}

const getDomainDetails = async (hostedZoneId) => {
  try {
    const params = {
      Id: `/hostedzone/${hostedZoneId}`
    };
    const data = await route53.getHostedZone(params).promise();
    if(!data) {
      throw new ApiError(404, 'Domain not found')
    }
    const domain = {
      id: data.HostedZone.Id.split('/').pop(),
      name: data.HostedZone.Name.replace(/\.$/, ''),
      comment: data.HostedZone.Config && data.HostedZone.Config.Comment,
      resourceRecordSetCount: data.HostedZone.ResourceRecordSetCount,
      nameServers: data.DelegationSet.NameServers
    };
    
    return domain
  }catch(error) {
    throw error
  }
}

const createDomain = async (domainBody) => {
  const params = {
    Name: domainBody.name,
    CallerReference: `${Date.now()}`,

    HostedZoneConfig: {
      Comment: domainBody.comment
    }
  };
  const data = await route53.createHostedZone(params).promise();
  const domain = {
    id: data.HostedZone.Id.split('/').pop(),
    name: data.HostedZone.Name.replace(/\.$/, ''),
    comment: data.HostedZone.Config && data.HostedZone.Config.Comment 
  };
  return domain
}

const updateDomain = async (hostedZoneId, domainBody) => {
  const params = {
    Id: `/hostedzone/${hostedZoneId}`,
    Comment: domainBody.comment
    
  };
  const domain = await getDomainDetails(hostedZoneId)
  if(!domain) {
    throw new ApiError(404, 'Domain with this hosted zone id not found')
  }
  await route53.updateHostedZoneComment(params).promise();
  return 'update successful'
}

const deleteDomain = async (hostedZoneId) => {
  const domain = await getDomainDetails(hostedZoneId)
  if(!domain) {
    throw new ApiError(404, 'Domain with this hosted zone id not found')
  }
  const params = {
    Id: `/hostedzone/${hostedZoneId}`
  };
  await route53.deleteHostedZone(params).promise();
  return 'delete successful'
}

const getDns = async () => {
  try {
    const data = await route53
      .listResourceRecordSets({ HostedZoneId: hostedZoneId })
      .promise();
    return data.ResourceRecordSets;
  } catch (error) {
    throw error;
  }
};

const createDns = async ({ name, type, value, ttl }) => {
  try {
    const existingRecord = await checkDns(name, type)
    if(existingRecord) {
      throw new ApiError(400, 'Dns already exists')
    }
    name += ".www.helloworld.com";
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "CREATE",
            ResourceRecordSet: {
              Name: name,
              Type: type,
              TTL: ttl,
              ResourceRecords: [{ Value: value }],
            },
          },
        ],
      },
      HostedZoneId: hostedZoneId,
    };

    const data = await route53.changeResourceRecordSets(params).promise();
    return data;
  } catch (error) {
    throw error;
  }
};

const editDns = async ({ recordName, recordType, value, ttl }) => {
  try {
    const existingRecord = await checkDns(recordName, recordType)
    if(!existingRecord) {
      throw new ApiError(404, 'Dns does not exists')
    }
    const changes = [
      {
        Action: "UPSERT",
        ResourceRecordSet: {
          Name: existingRecord.Name,
          Type: existingRecord.Type,
          TTL: ttl || existingRecord.TTL,
          ResourceRecords: [{ Value: value || existingRecord.ResourceRecords }],
        },
      },
    ];

    const changeParams = {
      ChangeBatch: {
        Changes: changes,
      },
      HostedZoneId: hostedZoneId,
    };
    const changeResponse = await route53
      .changeResourceRecordSets(changeParams)
      .promise();

    return changeResponse;
  } catch (error) {
    throw error;
  }
};

const deleteDns = async ({ recordName, recordType, ttl, value }) => {
  try {
    const dnsExists = await checkDns(recordName, recordType) 
    if(!dnsExists){
      throw new ApiError(404, 'Dns does not exists')
    }
    const changeParams = {
      ChangeBatch: {
        Changes: [
          {
            Action: "DELETE",
            ResourceRecordSet: {
              Name: recordName+".www.helloworld.com",
              Type: recordType,
              TTL: ttl,
              ResourceRecords: [
                {
                  Value: value,
                },
              ],
            },
           
          },
        ],
      },
      HostedZoneId: hostedZoneId,
    };

    const changeResponse = await route53
      .changeResourceRecordSets(changeParams)
      .promise();
    return changeResponse;
  } catch (error) {
    console.error("Error deleting DNS record:", error);
    throw error;
  }
};

async function checkDns(name, type) {
  const existingRecordParams = {
    HostedZoneId: hostedZoneId,
    StartRecordName: name+".www.helloworld.com",
    StartRecordType: type,
    MaxItems: '1'
  };
  const existingRecordResponse = await route53
    .listResourceRecordSets(existingRecordParams)
    .promise();
  const existingRecord = existingRecordResponse.ResourceRecordSets[0];
  return existingRecord
}

module.exports = {
  getDomains,
  getDomainDetails,
  createDomain,
  updateDomain,
  deleteDomain,
  getDns,
  createDns,
  editDns,
  deleteDns,
};
