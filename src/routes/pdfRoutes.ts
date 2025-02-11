import express from 'express';
import multer from 'multer';
import PDFController from '../controllers/PDFController';
import asyncHandler from '../asyncHandler';

const router = express.Router();
const upload = multer(); 

// Route to handle PDF upload
router.post('/upload', upload.single('file'), asyncHandler(PDFController.handlePdfProcessing));

export default router;
