# Sprint 5: Core Document Processing Engine

## Sprint Goal

Implement document upload, text extraction, and chunking pipeline.

## Key Deliverables

- Drag-and-drop file upload component.
- PDF/text extraction using PDF.js, pdf-parse, Tesseract.js.
- Document chunking and storage in DB.
- Processing status tracking.

## Detailed Tasks

1. Create drag-and-drop file upload component.
2. Integrate with upload API route.
3. Install PDF.js, pdf-parse, and Tesseract.js for extraction.
4. Implement text extraction for PDFs and scanned documents.
5. Create document chunking service (split text into semantic chunks).
6. Store chunks in the database.
7. Track processing status and errors.

## Acceptance Criteria

- Users can upload and process documents.
- Extracted text and chunks are saved in DB.
- Processing status is visible in the UI.
