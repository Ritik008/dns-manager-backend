const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const route53 = new AWS.Route53();
const hostedZoneId = "Z04391383RRGTNPDDFACG";

const getDns = async () => {
  try {
    const data = await route53
      .listResourceRecordSets({ HostedZoneId: hostedZoneId })
      .promise();
    return data.ResourceRecordSets;
  } catch (error) {
    console.error("Error listing hosted zones:", error);
    throw error;
  }
};

const createDns = async ({ name, type, value, ttl }) => {
  try {
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
    console.error("Error creating hosted zone:", error);
    throw error;
  }
};

const editDns = async ({ recordName, recordType, value, ttl }) => {
  try {
    const existingRecordParams = {
      HostedZoneId: hostedZoneId,
      StartRecordName: recordName,
      StartRecordType: recordType,
    };
    const existingRecordResponse = await route53
      .listResourceRecordSets(existingRecordParams)
      .promise();
    const existingRecord = existingRecordResponse.ResourceRecordSets[0];
    const changes = [
      {
        Action: "UPSERT",
        ResourceRecordSet: {
          Name: existingRecord.Name+".www.helloworld.com",
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
    console.error("Error creating hosted zone:", error);
    throw error;
  }
};

const deleteDns = async ({ recordName, recordType, ttl, value }) => {
  try {
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

module.exports = {
  getDns,
  createDns,
  editDns,
  deleteDns,
};
