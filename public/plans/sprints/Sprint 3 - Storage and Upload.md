# Sprint 3: Storage Integration & File Upload

## Sprint Goal

Enable secure document upload and storage integration.

## Key Deliverables

- Cloudinary account and SDK configured.
- Utility functions for upload, secure URL, and deletion.
- File upload API route.
- File type and size validation.
- Document metadata stored in DB.

## Detailed Tasks

1. Create a Cloudinary account and get API credentials.
2. Install Cloudinary SDK:
   - `npm install cloudinary`
3. Create utility functions for file upload, secure URL generation, and deletion.
4. Implement file upload API route (Next.js API route).
5. Validate file types (PDF, DOCX, TXT and more) and sizes.
6. Store file metadata (URL, type, size) in the database.
7. Implement file deletion and cleanup logic.

## Acceptance Criteria

- Users can upload and delete documents.
- Uploaded files are stored securely in Cloudinary.
- Metadata is correctly saved in the database.
