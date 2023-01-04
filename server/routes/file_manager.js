import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { 
  getFolders, 
  getFilesByFolder, 
  createFolder,
  deleteFile,
  uploadFiles,
  saveUploadedFiles,
  getFile
} from "../controllers/file_manager";
import { findPropertyByRef } from '../controllers/property.controller';

const router = express.Router();

const getFoldersByPropertyId = async (req, res) => {
  try {
    const { id:userId, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref:ref } = current_env;
    const { id:property_id } = await findPropertyByRef({ ref });
    const result = await getFolders({ property_id });
    res.send(result);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const createFolderByPropertyId = async (req, res) => {
  try {
    const { id:userId, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { name } = req.body.data;
    const { property_ref:ref } = current_env;
    const { id:property_id } = await findPropertyByRef({ ref });
    const result = await createFolder({ name, property_id });
    res.send(result);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const getFilesByFolderByPropertyId = async (req, res) => {
  try {
    const { id:userId, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { id: document_folder_id } = req.params;
    const { property_ref:ref } = current_env;
    const { id:property_id } = await findPropertyByRef({ ref });
    const result = await getFilesByFolder({ property_id, document_folder_id });
    res.send(result);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.use(cors());
router.get('/', getFoldersByPropertyId);
router.post('/', createFolderByPropertyId);
router.get('/file', getFile);
router.delete('/file/:id', deleteFile);
router.get('/:id', getFilesByFolderByPropertyId);
router.post('/upload-files', uploadFiles);
router.post('/save-uploaded-files', saveUploadedFiles);

module.exports = router;