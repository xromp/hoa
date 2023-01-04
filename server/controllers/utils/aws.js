import AWS from "aws-sdk";

const s3 = new AWS.S3({
  apiVersion: "2020-11-16",
  acesskeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "us-east-2"
});

const getBuckets = async () => {
  const { Buckets } = await s3.listBuckets().promise();
  return Buckets;
};

const getListObjects = async (params) => {
  const Buckets = await s3.listObjectsV2(params).promise();
  return Buckets;
};

const createEmptyFolder = async ({name, Bucket}) => {
  const response = await s3
    .putObject({ Key: `${name}/`, Bucket,})
    .promise();
  return response;
};

const getParentFolders = async ({ Bucket, subFolder }) => {
  const params  = {
    Bucket,
    Delimiter: '/',
    Prefix: `${subFolder}/`
  };

  if (!subFolder) delete params.Prefix;

  const { CommonPrefixes } = await getListObjects(params);
  return CommonPrefixes.map(({ Prefix }) => Prefix );
};

const getObjet = async ({ Key }) => {
  const params  = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
  };
  const data = await s3.getObject(params).promise();
  return data;
}

export {
  getBuckets,
  createEmptyFolder,
  getParentFolders,
  getObjet,
}