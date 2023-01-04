import AWS from 'aws-sdk';
const { v4: uuidv4 } = require('uuid');
const s3 = new AWS.S3({
  apiVersion: "2020-11-16",
  acesskeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "us-east-2"
})

const upload = async ({ file, path }) => {
  const { name, data, mimetype } = file;
  const fileCopy = name.split(".");
  const fileType = fileCopy[fileCopy.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: path ? `${path}/${uuidv4()}.${fileType}` : `${uuidv4()}.${fileType}`,
    Body: data
  };

  const response = await s3.upload(params).promise();
  response['mimeType'] = mimetype;
  response['original_file_name'] = name;
  return response;
}

export {
  upload,
}