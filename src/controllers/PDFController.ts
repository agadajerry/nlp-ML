import { Request, Response } from "express";
import pdfParse from "pdf-parse";

class PDFController {
  static async handlePdfProcessing(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const data = await pdfParse(file.buffer);  // Process the PDF buffer

      if (!data.text) {
        return res.status(404).send({ text: "No text found in PDF" });
      }

      return res.status(200).json({ text: data.text });  // Send extracted text

    } catch (error) {
      console.error("Error processing PDF:", error);
      return res.status(500).json({ error: "Failed to process PDF" });
    }
  }
}

export default PDFController;
