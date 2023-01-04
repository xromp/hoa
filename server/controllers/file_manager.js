import Document from '../models/document';
import DocumentFolder from '../models/document_folder';
import Property from '../models/property'
import { createEmptyFolder, getObjet } from "../controllers/utils/aws";
import { formatDate2 } from "../controllers/main";
import { upload } from './utils/uploadFile';
import { findPropertyByRef } from './property.controller';

Property.hasMany(DocumentFolder, {foreignKey: 'property_id'})

const getFolders = async ({ property_id }) => {
  const folders = await DocumentFolder.findAll({ 
    where: { 
      is_deleted: false,
      property_id
    } 
  });

  const property_folders = folders.map(({ id, name, val, createdAt, updatedAt }) => ({
    id,
    name,
    val,
    updatedAt: formatDate2(updatedAt || createdAt),
    size: '',
  }));

  const folderData = [...property_folders]
  return folderData
}

const getFilesByFolder = async ({ property_id, document_folder_id }) => {
  try {
    const generalFolders_hasAccess = await DocumentFolder.findAll({ 
      where: { 
        val: ['general', 'financials']
      }
    });

    const hasAccess = await DocumentFolder.findOne({ 
      where: { 
        is_deleted: false,
        id: document_folder_id,
        // property_id
      }
    });
    if (!hasAccess && !generalFolders_hasAccess) throw new Error('Folder access denied.')
    let params = {
      document_folder_id,
      is_deleted: false,
      property_id
    }

    hasAccess.val==='general' ? delete params.property_id : false

    const files = await Document.findAll({ 
      where: { ...params }
    });

    const fileData = files.map(({ 
      id,
      file_name, 
      original_file_name, 
      mime_type, 
      updatedAt 
    }) => ({ 
      id,
      file_name,
      original_file_name, 
      mime_type, 
      updatedAt,
    }));
    return fileData;
  } catch(err){
    throw new Error(err.toString('utf8'));
  }  
}

const getFile = async (req, res) => {
  try {
    const { path: Key } = req.query;
    const data = await getObjet({ Key });
    res.send(data);
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
}

const createFolder = async ({ name, property_id }) => {
  try {
    const isFoldernameExist = await DocumentFolder
      .findOne({ 
        where: { 
          name, 
          property_id,
          is_deleted: false 
        } 
      });
    if (!name) throw new Error('Folder name required');
    if (isFoldernameExist) throw new Error('Folder name exists.');
    const docFolder = {
      name,
      val: name.toLowerCase().replace(/ /g,"_"),
      parent_document_folder_id: 0,
      property_id,
      permission_json: [],
      prop_permission_json: [],
      unit_id: 0,
      pmc_id: 0,
      createdAt: new Date(),
    };
    const { id } = await DocumentFolder.create(docFolder);
    
    const folder = await createEmptyFolder({ 
      Bucket: process.env.AWS_BUCKET_NAME,
      name: `${property_id}/${id}`,
    });

    return folder;
  } catch(err){
    throw new Error(err.toString('utf8'));
  }  
}

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Document.update(
      { is_deleted: true },
      { where: { id } }
    );
    res.send(data);
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
}

const uploadFiles = async (req, res) => {
  try{
    const objEsi = Object.entries(req.files);
    const { folder_id, property_ref } = req.body;
    const { id:propertyId } = await findPropertyByRef({ ref: property_ref });
    const path = `${propertyId}/${folder_id}`;
    if (objEsi.length > 1) {
      
      const promises=[];
      for (const [key, value] of Object.entries(req.files)) {
        promises.push(upload({ file: value, path }));
      }

      Promise.all(promises).then(function(data){
          res.send({ uploadedD:data, rawD:req.files });
      }).catch(function(err){
          res.send(err.stack);
      }) 
    } else {
      upload({ file: req.files.fileD_0, path }, folder_id).then((data) => {
        res.send({ uploadedD:data, rawD:req.files });
      })
    }
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
}

const saveUploadedFiles = async (req, res) => {
  try{
    const uploadedFiles = [];
    let data = [];
    let objEsi = Object.entries(req.body.rawFiles)
    const { id:propertyId } = await findPropertyByRef({ ref: req.body.property_ref });

    if (objEsi.length == 0) return res.send({ uploadedFiles: null });
      
    if (objEsi.length > 1) {
      for (const [key, value] of Object.entries(req.body.rawFiles)) {
        data = {
          key: value.key, 
          document_folder_id: req.body.folderId,
          original_file_name: value.original_file_name,
          mime_type: value.mimeType,
          path: req.body.path,
          property_id: propertyId
        }
        uploadedFiles.push(await saveDocument(data));
      }
      res.send({ uploadedFiles });
    } else {
      data = {
        key: req.body.rawFiles[0]['key'], 
        document_folder_id: req.body.folderId,
        original_file_name: req.body.rawFiles[0]['original_file_name'],
        mime_type: req.body.rawFiles[0]['mimeType'],
        path: req.body.path,
        property_id: propertyId
      }
      const doc = await  saveDocument(data);
      res.send({ uploadedFiles: [doc] });
    }
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }    
}

const saveDocument = async (data) => {
  try {
    const doc = await Document.create({
      document_folder_id: data.document_folder_id,
      original_file_name: data.original_file_name,        
      file_name: data.key,
      path: data.path,
      mime_type: data.mime_type,
      property_id: data.property_id,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    return doc;
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
}

const createDefaultPropertyFolders = async({ property_id }) => {
  const folders = [
    { name: 'General' },
    { name: 'Financials' },
  ];
  for (const { name } of folders) {
    await createFolder({ name, property_id });
  }
}

export {
  getFolders,
  getFilesByFolder,
  getFile,
  createFolder,
  createDefaultPropertyFolders,
  deleteFile,
  uploadFiles,
  saveUploadedFiles
}
