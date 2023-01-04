const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const Docs = require('../models/document')
const DocFolder = require('../models/document_folder')
const today = new Date()
const s3 = new AWS.S3({
  apiVersion: "2020-11-16",
  acesskeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "us-east-2"
})

DocFolder.belongsTo(Docs, {targetKey:'document_folder_id',foreignKey: 'id'})

exports.postDocumentUpload = async (data) => {
	let result = []
  if (data.bodyFiles === null) return false
	let objData = Object.entries(data.bodyFiles)

  if (objData.length > 1) {
    let promises=[];

    for (const [key, value] of Object.entries(data.bodyFiles)) {
      promises.push(upload(value, data.filePath));
    }

    result = await Promise.all(promises)
    return ({ uploadedD:result, rawD:data.bodyFiles });
  } else {
    result = await upload(data.bodyFiles.fileD_0, data.filePath)
    return ({ uploadedD:result, rawD:data.bodyFiles });
  }	
}

exports.getDocumentByPath = async (data) => {
  const documents = await Docs.findAll({
    where: {
      path: data.bodyPath,
      is_deleted: 0
    },
    order: [
      ['id', 'DESC']
    ],
  })

  let objData = Object.entries(documents)

  if (objData.length >= 1) {      
    let promises=[];

    for (const [key, value] of Object.entries(documents)) {
      data = {
        key: value.file_name,         
      }

      promises.push(read(data));
    }

    const result = await Promise.all(promises)
    return ({ uploadedD:result }) 
  } else {
    return ({ uploadedD:null })
  }
}

exports.getDocumentFolder = async (data) => {
  const result = await DocFolder.findAll({
    where: {
      parent_document_folder_id: data.queryId
    },
    order: [
      ['id', 'ASC']
    ],
  })

  return result
}

exports.getDocumentById = async (data) => {
  const result = await Docs.findAll({
    where: {
      document_folder_id: data.queryId
    },
    order: [
      ['id', 'ASC']
    ],
  })

  return result
}

exports.postDocument = async (data) => {
  let uploadData = []
  let objData = Object.entries(data.rawFiles)
  let result = []

  if(objData.length === 0) {
    return ({ uploadedD:null });
  } else if (objData.length > 1) {
    let promises = []

    for (const [key, value] of Object.entries(data.rawFiles)) {
      uploadData = {
        key: value.key, 
        document_folder_id: data.folderId,
        original_file_name: value.original_file_name,
        mime_type: value.mimeType,
        path: data.path
      }

      promises.push(saveDocTable(uploadData));
    }

    result = await Promise.all(promises)
    return ({ uploadedD:result }) 
  } else {
    uploadData = {
      key: data.rawFiles[0]['key'], 
      document_folder_id: data.folderId,
      original_file_name: data.rawFiles[0]['original_file_name'],
      mime_type: data.rawFiles[0]['mimeType'],
      path: data.path
    }

    result = await saveDocTable(uploadData)
    return ({ uploadedD:result }) 
  }
}

exports.deleteDocument = async (data) => {
	let promises=[];

  for (const [key, value] of Object.entries(data)) {
    promises.push(delDocTable(value));
  }

  const result = await Promise.all(promises)
  return ({ uploadedD:result }) 
}

const read = (f) => {  
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: f.key,
    Expires: 60 * 480
  }

  return new Promise((resolve, reject) => {
    try {
      s3.getSignedUrl('getObject', params, (err, data) => {
        if (err) {
          throw new Error('Invalid credentials.')
        }
        resolve({data, key:f.key})
      })
    } catch(err) {
      reject(err.toString('utf8'))
    }
  })    
}

const upload = (f, filePath='') => {  
  let myFile = f.name.split(".")
  const fileType = myFile[myFile.length - 1]

  return new Promise((resolve, reject) => {
    try {
      AWS.config.getCredentials(function(err) {
        if (err) {
        	throw new Error('Invalid credentials.')
        }
        else {
          console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
      })

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filePath ? `${filePath}/${uuidv4()}.${fileType}` : `${uuidv4()}.${fileType}`,
        Body: f.data
      }

      s3.upload(params, (err, data) => {
        if (err) {
          return reject(err.toString('utf8'));
        }
        data['mimeType'] = f.mimetype
        data['original_file_name'] = f.name
        resolve(data)
      }) 

    } catch(err) {
      reject(err.toString('utf8'))
    }
  })  
}

const saveDocTable = async (data) => {
	const result = await Docs.create({
	  document_folder_id: data.document_folder_id,
	  original_file_name: data.original_file_name,        
	  file_name: data.key,
	  path: data.path,
	  mime_type: data.mime_type,
	  property_id: data.property_id,
	  updatedAt: today,
	  createdAt: today
	})

	return result
}

const delDocTable = async (data) => {
	const result = await Docs.update({
    is_deleted: 1
  },{
    where: {
      file_name: data
    }
  })

  return result
}

//not using
const checkSubFolder = async (data) => {
  return await DocFolder.findAll({
    where: {
      parent_document_folder_id: data.dataValues.id
    },
    order: [
      ['id', 'DESC']
    ],
  })
}