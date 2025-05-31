# Sprint 5: Core Document Processing Engine

> **Sprint 5 is now active. All work will strictly follow the Document Processing Flow and System Architecture as detailed in the flow diagrams (AcademiaLens Flow Diagrams.md) and architecture design (AcademiaLens System Architecture Design.md).**

### Flow/Architecture Reference Checklist

- [ ] Review flow diagrams before each implementation step
- [ ] Ensure all components/services match the architecture layers
- [ ] Document any deviations or improvements
- [ ] Validate integration points against diagrams

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

---

## Sprint 5 Breakdown

### 1. File Upload UI

- [ ] Design drag-and-drop upload component (React + Shadcn UI)
- [ ] Add file type/size validation
- [ ] Show upload progress and error states
- [ ] Integrate with upload API route

### 2. Upload API Route

- [ ] Create Next.js API endpoint for file uploads
- [ ] Handle file storage (local/dev or cloud)
- [ ] Return file URL and metadata

### 3. Text Extraction Service

- [ ] Integrate PDF.js/pdf-parse for PDF extraction
- [ ] Integrate Tesseract.js for OCR (scanned docs/images)
- [ ] Normalize and clean extracted text
- [ ] Handle extraction errors and edge cases

### 4. Document Chunking

- [ ] Define chunking strategy (semantic/length-based)
- [ ] Implement chunking logic
- [ ] Store chunks with references in DB

### 5. Database Integration

- [ ] Update Prisma schema for chunks if needed
- [ ] Store extracted text, chunks, and metadata
- [ ] Ensure referential integrity (document ↔ chunks)

### 6. Processing Status Tracking

- [ ] Track processing status for each document
- [ ] Expose status to frontend (API/store)
- [ ] Display status in dashboard UI

### 7. Testing & Validation

- [ ] Unit test upload, extraction, chunking
- [ ] End-to-end test document processing flow
- [ ] Validate against flow diagrams/architecture

---

## Next Steps

1. Scaffold drag-and-drop upload component (UI)
2. Create upload API route in Next.js
3. Integrate file upload with backend
4. Begin PDF/text extraction logic

> Reference flow diagrams and architecture docs at each step for alignment.
