# AcademiaLens Implementation Tasks

This document provides precise, small, actionable tasks for systematically building the AcademiaLens application, with special focus on database and storage integration throughout all modules.

## 1. Project Setup & Infrastructure

### 1.1 Next.js Project Initialization

1. ✅ Create Next.js 14+ project with TypeScript and App Router
   ```bash
   npx create-next-app@latest academialens --typescript --tailwind --app --eslint
   ```
2. ✅ Set up project directory structure following the file structure document
3. ✅ Configure ESLint and Prettier for code quality
4. ✅ Set up Git repository with proper .gitignore

### 1.2 Database Setup

1. ✅ Install PostgreSQL locally for development
   ```bash
   # For local development
   docker run --name academialens-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```
2. ✅ Install Prisma ORM and initialize
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```
3. ✅ Create Prisma schema file with all models from database schema document
   - Create `prisma/schema.prisma` with User, Account, Session models
   - Add Project, ProjectMember models with relationships
   - Add Document, DocumentChunk, DocumentEntity models
   - Add Analysis, Citation, AIInteraction, Glossary models
   - Add Notification, SystemSetting models
4. ✅ Set up environment variables for database connection
   ```
   # .env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/academialens"
   ```
5. ✅ Generate Prisma client and initial migration
   ```bash
   npx prisma migrate dev --name init
   ```
6. ✅ Create database utility file for Prisma client singleton

   ```typescript
   // lib/db/prisma.ts
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = global as unknown as { prisma: PrismaClient };

   export const prisma = globalForPrisma.prisma || new PrismaClient();

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

### 1.3 Authentication System

1. ✅ Install NextAuth.js
   ```bash
   npm install next-auth
   ```
2. ✅ Configure NextAuth with database adapter

   ```typescript
   // app/api/auth/[...nextauth]/route.ts
   import NextAuth from 'next-auth';
   import { PrismaAdapter } from '@auth/prisma-adapter';
   import { prisma } from '@/lib/db/prisma';
   import GoogleProvider from 'next-auth/providers/google';
   import CredentialsProvider from 'next-auth/providers/credentials';
   import bcrypt from 'bcryptjs';

   export const authOptions = {
     adapter: PrismaAdapter(prisma),
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       }),
       CredentialsProvider({
         // Implementation details
       }),
     ],
     // Additional configuration
   };

   const handler = NextAuth(authOptions);
   export { handler as GET, handler as POST };
   ```

3. ✅ Create authentication hooks and context

   ```typescript
   // hooks/auth/useAuth.ts
   import { useSession } from 'next-auth/react';

   export function useAuth() {
     const { data: session, status } = useSession();

     return {
       user: session?.user,
       isAuthenticated: status === 'authenticated',
       isLoading: status === 'loading',
     };
   }
   ```

4. ✅ Implement login, register, and password reset pages
5. ✅ Create authentication middleware for protected routes

   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';
   import { getToken } from 'next-auth/jwt';

   export async function middleware(request: NextRequest) {
     const token = await getToken({ req: request });

     if (!token) {
       return NextResponse.redirect(new URL('/login', request.url));
     }

     return NextResponse.next();
   }

   export const config = {
     matcher: ['/dashboard/:path*', '/documents/:path*', '/projects/:path*'],
   };
   ```

### 1.4 Storage Integration

1. ✅ Set up Cloudinary for document storage
   ```bash
   npm install cloudinary
   ```
2. ✅ Configure Cloudinary client

   ```typescript
   // lib/storage/cloudinary.ts
   import { v2 as cloudinary } from 'cloudinary';

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   export async function uploadToCloudinary(file: File): Promise<string> {
     // Implementation
   }

   export async function deleteFromCloudinary(publicId: string): Promise<void> {
     // Implementation
   }
   ```

3. ✅ Create storage service for document uploads

   ```typescript
   // lib/storage/documentStorage.ts
   import { uploadToCloudinary } from './cloudinary';
   import { prisma } from '@/lib/db/prisma';

   export async function storeDocument(file: File, userId: string, projectId?: string) {
     // Upload file to Cloudinary
     const fileUrl = await uploadToCloudinary(file);

     // Create document record in database
     const document = await prisma.document.create({
       data: {
         title: file.name,
         fileUrl,
         fileType: determineFileType(file.name),
         fileSize: file.size,
         userId,
         projectId,
         isProcessed: false,
       },
     });

     return document;
   }
   ```

### 1.5 UI Framework Setup

1. ✅ Configure Tailwind CSS with custom theme
   ```typescript
   // tailwind.config.js
   module.exports = {
     // Configuration based on the file structure document
   };
   ```
2. ✅ Install and set up Shadcn UI components
   ```bash
   npx shadcn-ui@latest init
   ```
3. ✅ Create base layout components (Header, Footer, Sidebar)
4. ✅ Implement responsive design utilities

### 1.6 State Management

1. ✅ Install Zustand for state management
   ```bash
   npm install zustand
   ```
2. ✅ Create store for user state

   ```typescript
   // lib/stores/authStore.ts
   import { create } from 'zustand';
   import { User } from '@prisma/client';

   interface AuthState {
     user: User | null;
     setUser: (user: User | null) => void;
   }

   export const useAuthStore = create<AuthState>(set => ({
     user: null,
     setUser: user => set({ user }),
   }));
   ```

3. ✅ Create store for document state

   ```typescript
   // lib/stores/documentStore.ts
   import { create } from 'zustand';
   import { Document } from '@prisma/client';

   interface DocumentState {
     documents: Document[];
     currentDocument: Document | null;
     isLoading: boolean;
     error: string | null;

     fetchDocuments: () => Promise<void>;
     fetchDocument: (id: string) => Promise<void>;
     // Additional actions
   }

   export const useDocumentStore = create<DocumentState>((set, get) => ({
     // Implementation
   }));
   ```

4. ✅ Create store for project state
5. ✅ Create store for analysis state

## 2. Universal Input & Ingestion Engine

### 2.1 Document Upload System

1. ✅ Create file upload component with drag-and-drop

   ```typescript
   // components/documents/FileUploader.tsx
   import { useState } from 'react';
   import { useDropzone } from 'react-dropzone';
   import { storeDocument } from '@/lib/storage/documentStorage';
   import { useAuth } from '@/hooks/auth/useAuth';

   export function FileUploader({ projectId }: { projectId?: string }) {
     const { user } = useAuth();
     const [uploading, setUploading] = useState(false);

     const onDrop = async (acceptedFiles: File[]) => {
       if (!user) return;

       setUploading(true);
       try {
         for (const file of acceptedFiles) {
           await storeDocument(file, user.id, projectId);
         }
       } catch (error) {
         console.error('Upload failed:', error);
       } finally {
         setUploading(false);
       }
     };

     const { getRootProps, getInputProps } = useDropzone({ onDrop });

     // Component JSX
   }
   ```

2. ✅ Implement API route for file uploads

   ```typescript
   // app/api/documents/route.ts
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { storeDocument } from '@/lib/storage/documentStorage';

   export async function POST(request: Request) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const formData = await request.formData();
     const file = formData.get('file') as File;
     const projectId = formData.get('projectId') as string;

     if (!file) {
       return NextResponse.json({ error: 'No file provided' }, { status: 400 });
     }

     try {
       const document = await storeDocument(file, session.user.id, projectId || undefined);
       return NextResponse.json(document);
     } catch (error) {
       console.error('Document upload failed:', error);
       return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
     }
   }
   ```

3. ✅ Create document list component with database integration

   ```typescript
   // components/documents/DocumentList.tsx
   import { useEffect } from 'react';
   import { useDocumentStore } from '@/lib/stores/documentStore';
   import { DocumentCard } from './DocumentCard';

   export function DocumentList({ projectId }: { projectId?: string }) {
     const { documents, isLoading, fetchDocuments } = useDocumentStore();

     useEffect(() => {
       fetchDocuments(projectId);
     }, [fetchDocuments, projectId]);

     // Component JSX
   }
   ```

4. ✅ Implement document deletion with database and storage cleanup

   ```typescript
   // lib/documents/documentService.ts
   import { prisma } from '@/lib/db/prisma';
   import { deleteFromCloudinary } from '@/lib/storage/cloudinary';

   export async function deleteDocument(id: string, userId: string) {
     // Get document to check ownership and get file URL
     const document = await prisma.document.findFirst({
       where: { id, userId },
     });

     if (!document) {
       throw new Error('Document not found or access denied');
     }

     // Extract public ID from Cloudinary URL
     const publicId = extractPublicIdFromUrl(document.fileUrl);

     // Delete from Cloudinary
     await deleteFromCloudinary(publicId);

     // Delete from database (cascades to chunks, entities, etc.)
     await prisma.document.delete({
       where: { id },
     });
   }
   ```

### 2.2 Document Processing

1. ✅ Create PDF text extraction service

   ```typescript
   // lib/documents/extraction.ts
   import pdfParse from 'pdf-parse';

   export async function extractTextFromPdf(pdfBuffer: Buffer) {
     try {
       const result = await pdfParse(pdfBuffer);
       return {
         text: result.text,
         pageCount: result.numpages,
       };
     } catch (error) {
       console.error('PDF extraction failed:', error);
       throw new Error('Failed to extract text from PDF');
     }
   }
   ```

2. ✅ Implement OCR for scanned documents

   ```typescript
   // lib/documents/ocr.ts
   import Tesseract from 'tesseract.js';

   export async function performOcr(imageBuffer: Buffer) {
     try {
       const result = await Tesseract.recognize(imageBuffer, 'eng');
       return result.data.text;
     } catch (error) {
       console.error('OCR failed:', error);
       throw new Error('Failed to perform OCR');
     }
   }
   ```

3. ✅ Create document chunking service with database integration

   ```typescript
   // lib/documents/chunking.ts
   import { prisma } from '@/lib/db/prisma';

   export async function chunkDocument(documentId: string, text: string) {
     // Simple chunking by paragraphs (can be more sophisticated)
     const paragraphs = text.split(/\n\s*\n/);
     const chunks = [];

     // Create chunks with overlap
     for (let i = 0; i < paragraphs.length; i++) {
       const chunkText = paragraphs[i].trim();
       if (chunkText.length === 0) continue;

       chunks.push({
         documentId,
         content: chunkText,
         chunkIndex: i,
       });
     }

     // Store chunks in database
     await prisma.documentChunk.createMany({
       data: chunks,
     });

     return chunks.length;
   }
   ```

4. ✅ Implement document processing queue with database status updates

   ```typescript
   // lib/documents/processingQueue.ts
   import { prisma } from '@/lib/db/prisma';
   import { extractTextFromPdf } from './extraction';
   import { performOcr } from './ocr';
   import { chunkDocument } from './chunking';
   import { extractMetadata } from './metadata';
   import { generateEmbeddings } from './embeddings';
   import { extractEntities } from './entities';

   export async function processDocument(documentId: string) {
     try {
       // Update status to processing
       await prisma.document.update({
         where: { id: documentId },
         data: { isProcessed: false },
       });

       // Get document from database
       const document = await prisma.document.findUnique({
         where: { id: documentId },
       });

       if (!document) throw new Error('Document not found');

       // Download file from storage
       const fileBuffer = await downloadFile(document.fileUrl);

       // Extract text based on file type
       let extractedText = '';
       if (document.fileType === 'PDF') {
         const { text, pageCount } = await extractTextFromPdf(fileBuffer);
         extractedText = text;

         // Update page count
         await prisma.document.update({
           where: { id: documentId },
           data: { pageCount },
         });
       } else if (document.fileType === 'IMAGE') {
         extractedText = await performOcr(fileBuffer);
       } else {
         // Handle other file types
       }

       // Update document with extracted text
       await prisma.document.update({
         where: { id: documentId },
         data: { extractedText },
       });

       // Extract metadata
       const metadata = await extractMetadata(extractedText);
       await prisma.document.update({
         where: { id: documentId },
         data: { metadata },
       });

       // Chunk document and store in database
       await chunkDocument(documentId, extractedText);

       // Generate embeddings for chunks
       await generateEmbeddings(documentId);

       // Extract entities
       await extractEntities(documentId, extractedText);

       // Update status to processed
       await prisma.document.update({
         where: { id: documentId },
         data: { isProcessed: true },
       });

       // Create notification for user
       await prisma.notification.create({
         data: {
           userId: document.userId,
           type: 'DOCUMENT_PROCESSED',
           title: 'Document Processing Complete',
           message: `Your document "${document.title}" has been processed and is ready for analysis.`,
         },
       });
     } catch (error) {
       console.error('Document processing failed:', error);

       // Update document with error
       await prisma.document.update({
         where: { id: documentId },
         data: {
           isProcessed: false,
           processingError: error.message,
         },
       });
     }
   }
   ```

5. ✅ Create API route for document processing

   ```typescript
   // app/api/documents/[id]/process/route.ts
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { prisma } from '@/lib/db/prisma';
   import { processDocument } from '@/lib/documents/processingQueue';

   export async function POST(request: Request, { params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const { id } = params;

     // Check if document exists and belongs to user
     const document = await prisma.document.findFirst({
       where: {
         id,
         userId: session.user.id,
       },
     });

     if (!document) {
       return NextResponse.json({ error: 'Document not found' }, { status: 404 });
     }

     // Process document (ideally in a background job)
     processDocument(id).catch(console.error);

     return NextResponse.json({ message: 'Processing started' });
   }
   ```

### 2.3 Vector Embeddings

1. ✅ Install pgvector extension for PostgreSQL
   ```sql
   -- Run in PostgreSQL
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
2. ✅ Update Prisma schema for vector support

   ```prisma
   // Add to schema.prisma
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["postgresqlExtensions"]
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     extensions = [vector]
   }
   ```

3. ✅ Create embedding generation service

   ```typescript
   // lib/documents/embeddings.ts
   import { prisma } from '@/lib/db/prisma';
   import { SentenceTransformerEmbedding } from '@/lib/ai/embeddings';

   export async function generateEmbeddings(documentId: string) {
     // Get all chunks for the document
     const chunks = await prisma.documentChunk.findMany({
       where: { documentId },
       orderBy: { chunkIndex: 'asc' },
     });

     // Initialize embedding model
     const embeddingModel = new SentenceTransformerEmbedding();

     // Process chunks in batches
     for (const chunk of chunks) {
       // Generate embedding
       const embedding = await embeddingModel.embed(chunk.content);

       // Store embedding in database
       await prisma.documentChunk.update({
         where: { id: chunk.id },
         data: { embedding },
       });
     }
   }
   ```

4. ✅ Implement semantic search with vector database

   ```typescript
   // lib/documents/semanticSearch.ts
   import { prisma } from '@/lib/db/prisma';
   import { SentenceTransformerEmbedding } from '@/lib/ai/embeddings';

   export async function semanticSearch(query: string, limit = 5) {
     // Generate embedding for query
     const embeddingModel = new SentenceTransformerEmbedding();
     const queryEmbedding = await embeddingModel.embed(query);

     // Search for similar chunks
     const similarChunks = await prisma.$queryRaw`
       SELECT c.id, c.content, c.documentId, c."chunkIndex", c."pageNumber",
              d.title as documentTitle,
              1 - (c.embedding <=> ${queryEmbedding}::vector) as similarity
       FROM "DocumentChunk" c
       JOIN "Document" d ON c."documentId" = d.id
       WHERE c.embedding IS NOT NULL
       ORDER BY c.embedding <=> ${queryEmbedding}::vector
       LIMIT ${limit}
     `;

     return similarChunks;
   }
   ```

### 2.4 Entity Extraction

1. ✅ Create entity extraction service with database integration

   ```typescript
   // lib/documents/entities.ts
   import { prisma } from '@/lib/db/prisma';
   import { GeminiService } from '@/lib/ai/gemini';

   export async function extractEntities(documentId: string, text: string) {
     const gemini = new GeminiService();

     // Use Gemini to extract entities
     const prompt = `
       Extract all important entities from the following academic text.
       Categorize each entity as one of: KEYWORD, PERSON, ORGANIZATION, LOCATION, CONCEPT, METHOD, DATASET, VARIABLE, ACRONYM, JARGON.
       For each entity, provide a brief definition if possible, and note all occurrences (approximate position in text).
       Format as JSON.
       
       Text: ${text.substring(0, 10000)} // Limit text length for API
     `;

     const response = await gemini.generateContent(prompt);
     const entities = JSON.parse(response.text);

     // Store entities in database
     for (const entity of entities) {
       await prisma.documentEntity.create({
         data: {
           documentId,
           name: entity.name,
           type: entity.type,
           definition: entity.definition,
           occurrences: entity.occurrences,
         },
       });
     }

     return entities.length;
   }
   ```

2. ✅ Create API route for entity retrieval

   ```typescript
   // app/api/documents/[id]/entities/route.ts
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { prisma } from '@/lib/db/prisma';

   export async function GET(request: Request, { params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const { id } = params;

     // Check if document exists and belongs to user
     const document = await prisma.document.findFirst({
       where: {
         id,
         OR: [
           { userId: session.user.id },
           {
             project: {
               members: {
                 some: {
                   userId: session.user.id,
                 },
               },
             },
           },
         ],
       },
     });

     if (!document) {
       return NextResponse.json({ error: 'Document not found' }, { status: 404 });
     }

     // Get entities for document
     const entities = await prisma.documentEntity.findMany({
       where: { documentId: id },
       orderBy: { name: 'asc' },
     });

     return NextResponse.json(entities);
   }
   ```

## 3. Insight Extractor Module

### 3.1 Gemini AI Integration

1. ✅ Set up Gemini API client

   ```typescript
   // lib/ai/gemini.ts
   import { GoogleGenerativeAI } from '@google/generative-ai';

   export class GeminiService {
     private genAI: GoogleGenerativeAI;
     private model: any;

     constructor() {
       this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
       this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
     }

     async generateContent(prompt: string) {
       try {
         const result = await this.model.generateContent(prompt);
         const response = result.response;
         return {
           text: response.text(),
           confidenceScore: response.candidates?.[0]?.confidenceScore || 0,
         };
       } catch (error) {
         console.error('Gemini API error:', error);
         throw new Error('Failed to generate content with Gemini API');
       }
     }
   }
   ```

2. ✅ Create prompt management system

   ```typescript
   // lib/ai/prompts.ts
   export const PROMPT_TEMPLATES = {
     SUMMARY: `
       Summarize the following academic content in {{length}} words, focusing on {{focus}}.
       Provide precise citations for all key points, including page numbers or section references.
       
       Content: {{content}}
     `,
     EXPLANATION: `
       Explain the following academic content at a {{level}} level, focusing on {{focus}}.
       Provide precise citations for all key points, including page numbers or section references.
       Use chain-of-thought reasoning to make your explanation process transparent.
       
       Content: {{content}}
     `,
     // Additional templates
   };

   export function generatePrompt(
     templateName: keyof typeof PROMPT_TEMPLATES,
     params: Record<string, any>,
   ) {
     let prompt = PROMPT_TEMPLATES[templateName];

     // Replace placeholders with actual values
     Object.entries(params).forEach(([key, value]) => {
       prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
     });

     return prompt;
   }
   ```

3. ✅ Implement AI interaction tracking in database

   ```typescript
   // lib/ai/tracking.ts
   import { prisma } from '@/lib/db/prisma';

   export async function trackAIInteraction(
     userId: string,
     prompt: string,
     response: string,
     tokensUsed: number,
     analysisId?: string,
   ) {
     return prisma.aIInteraction.create({
       data: {
         userId,
         prompt,
         response,
         tokensUsed,
         analysisId,
       },
     });
   }
   ```

4. ✅ Create AI service with database integration

   ```typescript
   // lib/ai/aiService.ts
   import { GeminiService } from './gemini';
   import { generatePrompt } from './prompts';
   import { trackAIInteraction } from './tracking';
   import { estimateTokens } from './tokenizer';

   export async function generateAIContent(
     templateName: string,
     params: Record<string, any>,
     userId: string,
     analysisId?: string,
   ) {
     const gemini = new GeminiService();

     // Generate prompt from template
     const prompt = generatePrompt(templateName, params);

     // Generate content
     const response = await gemini.generateContent(prompt);

     // Estimate tokens used
     const tokensUsed = estimateTokens(prompt) + estimateTokens(response.text);

     // Track interaction in database
     await trackAIInteraction(userId, prompt, response.text, tokensUsed, analysisId);

     return response;
   }
   ```

### 3.2 Summary Generation

1. ✅ Create summary generation service with database integration

   ```typescript
   // lib/analysis/summary.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';

   export async function generateSummary(
     documentId: string,
     userId: string,
     options: {
       length: 'short' | 'medium' | 'long';
       focus: string;
     },
   ) {
     // Get document from database
     const document = await prisma.document.findUnique({
       where: { id: documentId },
     });

     if (!document) throw new Error('Document not found');
     if (!document.extractedText) throw new Error('Document has not been processed');

     // Create analysis record
     const analysis = await prisma.analysis.create({
       data: {
         type: 'SUMMARY',
         status: 'PENDING',
         userId,
         parameters: options,
         documents: {
           connect: { id: documentId },
         },
       },
     });

     try {
       // Generate summary
       const wordCount = options.length === 'short' ? 150 : options.length === 'medium' ? 300 : 500;

       const response = await generateAIContent(
         'SUMMARY',
         {
           content: document.extractedText,
           length: wordCount,
           focus: options.focus,
         },
         userId,
         analysis.id,
       );

       // Extract citations
       const citations = extractCitations(response.text, documentId);

       // Create citation records
       for (const citation of citations) {
         await prisma.citation.create({
           data: {
             ...citation,
             analysisId: analysis.id,
           },
         });
       }

       // Update analysis with results
       await prisma.analysis.update({
         where: { id: analysis.id },
         data: {
           status: 'COMPLETED',
           result: { summary: response.text },
           completedAt: new Date(),
         },
       });

       // Create notification
       await prisma.notification.create({
         data: {
           userId,
           type: 'ANALYSIS_COMPLETED',
           title: 'Summary Generated',
           message: `Summary for "${document.title}" is now available.`,
         },
       });

       return {
         summary: response.text,
         citations,
         analysisId: analysis.id,
       };
     } catch (error) {
       // Update analysis with error
       await prisma.analysis.update({
         where: { id: analysis.id },
         data: {
           status: 'FAILED',
           error: error.message,
         },
       });

       throw error;
     }
   }

   function extractCitations(text: string, documentId: string) {
     // Implementation to extract citations from text
     // This would parse the text for citation patterns and extract them

     return []; // Array of citation objects
   }
   ```

2. ✅ Create API route for summary generation

   ```typescript
   // app/api/documents/[id]/summary/route.ts
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { generateSummary } from '@/lib/analysis/summary';

   export async function POST(request: Request, { params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const { id } = params;
     const { length, focus } = await request.json();

     try {
       const result = await generateSummary(id, session.user.id, { length, focus });
       return NextResponse.json(result);
     } catch (error) {
       console.error('Summary generation failed:', error);
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
   }
   ```

3. ✅ Create summary component with database integration

   ```typescript
   // components/analysis/SummaryGenerator.tsx
   import { useState } from 'react';
   import { useAuth } from '@/hooks/auth/useAuth';

   export function SummaryGenerator({ documentId }: { documentId: string }) {
     const { user } = useAuth();
     const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
     const [focus, setFocus] = useState('comprehensive');
     const [loading, setLoading] = useState(false);
     const [summary, setSummary] = useState('');

     const handleGenerateSummary = async () => {
       if (!user) return;

       setLoading(true);
       try {
         const response = await fetch(`/api/documents/${documentId}/summary`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ length, focus }),
         });

         if (!response.ok) throw new Error('Failed to generate summary');

         const data = await response.json();
         setSummary(data.summary);
       } catch (error) {
         console.error('Summary generation failed:', error);
       } finally {
         setLoading(false);
       }
     };

     // Component JSX
   }
   ```

### 3.3 Explanation Generation

1. ✅ Create explanation generation service with database integration

   ```typescript
   // lib/analysis/explanation.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';

   export async function generateExplanation(
     documentId: string,
     userId: string,
     options: {
       level: 'layperson' | 'executive' | 'peer';
       focus: string;
     },
   ) {
     // Similar implementation to summary generation
     // with appropriate prompt template and analysis type
   }
   ```

2. ✅ Create API route for explanation generation
3. ✅ Create explanation component with database integration

### 3.4 Entity Recognition

1. ✅ Create entity viewer component with database integration

   ```typescript
   // components/documents/EntityViewer.tsx
   import { useEffect, useState } from 'react';

   export function EntityViewer({ documentId }: { documentId: string }) {
     const [entities, setEntities] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchEntities = async () => {
         try {
           const response = await fetch(`/api/documents/${documentId}/entities`);
           if (!response.ok) throw new Error('Failed to fetch entities');

           const data = await response.json();
           setEntities(data);
         } catch (error) {
           console.error('Entity fetch failed:', error);
         } finally {
           setLoading(false);
         }
       };

       fetchEntities();
     }, [documentId]);

     // Component JSX
   }
   ```

2. ✅ Create glossary service with database integration

   ```typescript
   // lib/glossary/glossaryService.ts
   import { prisma } from '@/lib/db/prisma';

   export async function createGlossary(
     name: string,
     description: string,
     userId: string,
     projectId?: string,
   ) {
     return prisma.glossary.create({
       data: {
         name,
         description,
         userId,
         projectId,
       },
     });
   }

   export async function addEntityToGlossary(glossaryId: string, entityId: string) {
     // Get entity
     const entity = await prisma.documentEntity.findUnique({
       where: { id: entityId },
     });

     if (!entity) throw new Error('Entity not found');

     // Update entity with glossary ID
     return prisma.documentEntity.update({
       where: { id: entityId },
       data: { glossaryId },
     });
   }
   ```

## 4. Deconstruction Toolkit Module

### 4.1 Methodology Analysis

1. ✅ Create methodology extraction service with database integration

   ```typescript
   // lib/analysis/methodology.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';

   export async function extractMethodology(documentId: string, userId: string) {
     // Implementation similar to other analysis services
     // with appropriate prompt template and analysis type
   }
   ```

2. ✅ Create API route for methodology extraction
3. ✅ Create methodology visualization component

   ```typescript
   // components/analysis/MethodologyVisualizer.tsx
   import { useEffect, useState } from 'react';
   import mermaid from 'mermaid';

   export function MethodologyVisualizer({ analysisId }: { analysisId: string }) {
     const [methodology, setMethodology] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchMethodology = async () => {
         try {
           const response = await fetch(`/api/analysis/${analysisId}`);
           if (!response.ok) throw new Error('Failed to fetch methodology');

           const data = await response.json();
           setMethodology(data.result);
         } catch (error) {
           console.error('Methodology fetch failed:', error);
         } finally {
           setLoading(false);
         }
       };

       fetchMethodology();
     }, [analysisId]);

     useEffect(() => {
       if (methodology?.flowchart) {
         mermaid.init(undefined, document.querySelector('.mermaid'));
       }
     }, [methodology]);

     // Component JSX
   }
   ```

### 4.2 Claims & Evidence Mapping

1. ✅ Create claims extraction service with database integration

   ```typescript
   // lib/analysis/claims.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';

   export async function extractClaimsAndEvidence(documentId: string, userId: string) {
     // Implementation similar to other analysis services
     // with appropriate prompt template and analysis type
   }
   ```

2. ✅ Create API route for claims extraction
3. ✅ Create claims visualization component with database integration

## 5. Synthesis & Connection Hub Module

### 5.1 Cross-Document Analysis

1. ✅ Create cross-document analysis service with database integration

   ```typescript
   // lib/analysis/crossDocument.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';
   import { semanticSearch } from '@/lib/documents/semanticSearch';

   export async function analyzeCrossDocument(
     documentIds: string[],
     userId: string,
     options: {
       analysisType: 'consensus' | 'conflict' | 'gaps';
     },
   ) {
     // Create analysis record
     const analysis = await prisma.analysis.create({
       data: {
         type: 'CROSS_DOCUMENT',
         status: 'PENDING',
         userId,
         parameters: options,
         documents: {
           connect: documentIds.map(id => ({ id })),
         },
       },
     });

     try {
       // Get documents
       const documents = await prisma.document.findMany({
         where: {
           id: { in: documentIds },
         },
         select: {
           id: true,
           title: true,
           extractedText: true,
         },
       });

       // Prepare document content
       const documentContent = documents.map(doc => ({
         id: doc.id,
         title: doc.title,
         content: doc.extractedText?.substring(0, 5000) || '', // Limit content length
       }));

       // Generate cross-document analysis
       const response = await generateAIContent(
         'CROSS_DOCUMENT',
         {
           documents: documentContent,
           analysisType: options.analysisType,
         },
         userId,
         analysis.id,
       );

       // Update analysis with results
       await prisma.analysis.update({
         where: { id: analysis.id },
         data: {
           status: 'COMPLETED',
           result: { analysis: response.text },
           completedAt: new Date(),
         },
       });

       // Create notification
       await prisma.notification.create({
         data: {
           userId,
           type: 'ANALYSIS_COMPLETED',
           title: 'Cross-Document Analysis Completed',
           message: `Your cross-document analysis is now available.`,
         },
       });

       return {
         analysis: response.text,
         analysisId: analysis.id,
       };
     } catch (error) {
       // Update analysis with error
       await prisma.analysis.update({
         where: { id: analysis.id },
         data: {
           status: 'FAILED',
           error: error.message,
         },
       });

       throw error;
     }
   }
   ```

2. ✅ Create API route for cross-document analysis
3. ✅ Create document selection component with database integration

   ```typescript
   // components/analysis/DocumentSelector.tsx
   import { useEffect, useState } from 'react';
   import { useDocumentStore } from '@/lib/stores/documentStore';

   export function DocumentSelector({ onSelect }: { onSelect: (ids: string[]) => void }) {
     const { documents, fetchDocuments } = useDocumentStore();
     const [selectedIds, setSelectedIds] = useState<string[]>([]);

     useEffect(() => {
       fetchDocuments();
     }, [fetchDocuments]);

     const handleToggleDocument = (id: string) => {
       setSelectedIds(prev =>
         prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id],
       );
     };

     const handleConfirm = () => {
       onSelect(selectedIds);
     };

     // Component JSX
   }
   ```

### 5.2 Visualization Components

1. ✅ Create mind map visualization component

   ```typescript
   // components/visualizations/MindMap.tsx
   import { useEffect, useRef } from 'react';
   import * as d3 from 'd3';

   export function MindMap({ data }: { data: any }) {
     const svgRef = useRef(null);

     useEffect(() => {
       if (!data || !svgRef.current) return;

       // D3.js implementation for mind map
       // This would create an interactive mind map visualization
     }, [data]);

     return <svg ref={svgRef} width="100%" height="500px" />;
   }
   ```

2. ✅ Create comparison table component

   ```typescript
   // components/visualizations/ComparisonTable.tsx
   export function ComparisonTable({ data }: { data: any }) {
     if (!data || !data.length) return <div>No comparison data available</div>;

     // Component JSX for comparison table
   }
   ```

## 6. Application & Foresight Engine Module

### 6.1 SWOT Analysis

1. ✅ Create SWOT analysis service with database integration

   ```typescript
   // lib/analysis/swot.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';

   export async function generateSwotAnalysis(documentId: string, userId: string) {
     // Implementation similar to other analysis services
     // with appropriate prompt template and analysis type
   }
   ```

2. ✅ Create API route for SWOT analysis
3. ✅ Create SWOT visualization component with database integration

### 6.2 Ethical Impact Analysis

1. ✅ Create ethical impact analysis service with database integration

   ```typescript
   // lib/analysis/ethical.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';

   export async function analyzeEthicalImpact(documentId: string, userId: string) {
     // Implementation similar to other analysis services
     // with appropriate prompt template and analysis type
   }
   ```

2. ✅ Create API route for ethical impact analysis
3. ✅ Create ethical impact visualization component with database integration

## 7. Interactive Knowledge Assistant Module

### 7.1 Question Answering System

1. ✅ Create RAG-based Q&A service with database integration

   ```typescript
   // lib/qa/questionAnswering.ts
   import { prisma } from '@/lib/db/prisma';
   import { generateAIContent } from '@/lib/ai/aiService';
   import { semanticSearch } from '@/lib/documents/semanticSearch';

   export async function answerQuestion(
     question: string,
     documentId: string,
     userId: string,
     conversationId?: string,
   ) {
     // Find relevant chunks using semantic search
     const relevantChunks = await semanticSearch(question, 3);

     // Get previous conversation context if available
     let conversationContext = '';
     if (conversationId) {
       const previousInteractions = await prisma.aIInteraction.findMany({
         where: { analysisId: conversationId },
         orderBy: { createdAt: 'asc' },
         take: 5,
       });

       conversationContext = previousInteractions
         .map(interaction => `Q: ${interaction.prompt}\nA: ${interaction.response}`)
         .join('\n\n');
     }

     // Create or get analysis record for conversation
     let analysis;
     if (conversationId) {
       analysis = await prisma.analysis.findUnique({
         where: { id: conversationId },
       });
     } else {
       analysis = await prisma.analysis.create({
         data: {
           type: 'QA',
           status: 'COMPLETED',
           userId,
           documents: {
             connect: { id: documentId },
           },
         },
       });
     }

     // Generate answer
     const context = relevantChunks
       .map(chunk => `From "${chunk.documentTitle}":\n${chunk.content}`)
       .join('\n\n');

     const response = await generateAIContent(
       'QA',
       {
         question,
         context,
         conversationContext,
       },
       userId,
       analysis.id,
     );

     return {
       answer: response.text,
       sources: relevantChunks.map(chunk => ({
         documentId: chunk.documentId,
         documentTitle: chunk.documentTitle,
         pageNumber: chunk.pageNumber,
         similarity: chunk.similarity,
       })),
       conversationId: analysis.id,
     };
   }
   ```

2. ✅ Create API route for question answering

   ```typescript
   // app/api/documents/[id]/qa/route.ts
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { answerQuestion } from '@/lib/qa/questionAnswering';

   export async function POST(request: Request, { params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const { id } = params;
     const { question, conversationId } = await request.json();

     try {
       const result = await answerQuestion(question, id, session.user.id, conversationId);
       return NextResponse.json(result);
     } catch (error) {
       console.error('Question answering failed:', error);
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
   }
   ```

3. ✅ Create Q&A interface component with database integration

   ```typescript
   // components/qa/QuestionAnswering.tsx
   import { useState } from 'react';

   export function QuestionAnswering({ documentId }: { documentId: string }) {
     const [question, setQuestion] = useState('');
     const [answer, setAnswer] = useState('');
     const [sources, setSources] = useState([]);
     const [conversationId, setConversationId] = useState('');
     const [loading, setLoading] = useState(false);

     const handleAskQuestion = async () => {
       if (!question.trim()) return;

       setLoading(true);
       try {
         const response = await fetch(`/api/documents/${documentId}/qa`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ question, conversationId }),
         });

         if (!response.ok) throw new Error('Failed to get answer');

         const data = await response.json();
         setAnswer(data.answer);
         setSources(data.sources);
         setConversationId(data.conversationId);
       } catch (error) {
         console.error('Question answering failed:', error);
       } finally {
         setLoading(false);
       }
     };

     // Component JSX
   }
   ```

### 7.2 Glossary Management

1. ✅ Create glossary management service with database integration

   ```typescript
   // lib/glossary/glossaryManagement.ts
   import { prisma } from '@/lib/db/prisma';

   export async function getGlossaries(userId: string) {
     return prisma.glossary.findMany({
       where: {
         OR: [
           { userId },
           {
             project: {
               members: {
                 some: {
                   userId,
                 },
               },
             },
           },
         ],
       },
       include: {
         entries: true,
       },
     });
   }

   export async function getGlossary(id: string) {
     return prisma.glossary.findUnique({
       where: { id },
       include: {
         entries: true,
       },
     });
   }

   export async function updateGlossary(
     id: string,
     data: {
       name?: string;
       description?: string;
       isAutoUpdated?: boolean;
     },
   ) {
     return prisma.glossary.update({
       where: { id },
       data,
     });
   }

   export async function deleteGlossary(id: string) {
     // This will set glossaryId to null for all associated entities
     return prisma.glossary.delete({
       where: { id },
     });
   }
   ```

2. ✅ Create API routes for glossary management
3. ✅ Create glossary management components with database integration

## 8. Project Management Module

### 8.1 Project CRUD Operations

1. ✅ Create project service with database integration

   ```typescript
   // lib/projects/projectService.ts
   import { prisma } from '@/lib/db/prisma';

   export async function createProject(name: string, description: string, userId: string) {
     return prisma.project.create({
       data: {
         name,
         description,
         userId,
       },
     });
   }

   export async function getProjects(userId: string) {
     return prisma.project.findMany({
       where: {
         OR: [
           { userId },
           {
             members: {
               some: {
                 userId,
               },
             },
           },
         ],
         isArchived: false,
       },
       include: {
         user: true,
         members: {
           include: {
             user: true,
           },
         },
         _count: {
           select: {
             documents: true,
             analyses: true,
           },
         },
       },
     });
   }

   export async function getProject(id: string) {
     return prisma.project.findUnique({
       where: { id },
       include: {
         user: true,
         members: {
           include: {
             user: true,
           },
         },
         documents: true,
         analyses: true,
       },
     });
   }

   export async function updateProject(
     id: string,
     data: {
       name?: string;
       description?: string;
       isArchived?: boolean;
     },
   ) {
     return prisma.project.update({
       where: { id },
       data,
     });
   }

   export async function deleteProject(id: string) {
     // This will cascade delete all project members
     // Documents and analyses will remain but with projectId set to null
     return prisma.project.delete({
       where: { id },
     });
   }
   ```

2. ✅ Create API routes for project management

   ```typescript
   // app/api/projects/route.ts
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { createProject, getProjects } from '@/lib/projects/projectService';

   export async function GET(request: Request) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     try {
       const projects = await getProjects(session.user.id);
       return NextResponse.json(projects);
     } catch (error) {
       console.error('Project fetch failed:', error);
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
   }

   export async function POST(request: Request) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const { name, description } = await request.json();

     if (!name) {
       return NextResponse.json({ error: 'Name is required' }, { status: 400 });
     }

     try {
       const project = await createProject(name, description || '', session.user.id);
       return NextResponse.json(project);
     } catch (error) {
       console.error('Project creation failed:', error);
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
   }
   ```

3. ✅ Create project management components with database integration

   ```typescript
   // components/projects/ProjectList.tsx
   import { useEffect, useState } from 'react';

   export function ProjectList() {
     const [projects, setProjects] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchProjects = async () => {
         try {
           const response = await fetch('/api/projects');
           if (!response.ok) throw new Error('Failed to fetch projects');

           const data = await response.json();
           setProjects(data);
         } catch (error) {
           console.error('Project fetch failed:', error);
         } finally {
           setLoading(false);
         }
       };

       fetchProjects();
     }, []);

     // Component JSX
   }
   ```

### 8.2 Collaboration Features

1. ✅ Create project sharing service with database integration

   ```typescript
   // lib/projects/sharingService.ts
   import { prisma } from '@/lib/db/prisma';

   export async function shareProject(projectId: string, email: string, role: 'EDITOR' | 'VIEWER') {
     // Find user by email
     const user = await prisma.user.findUnique({
       where: { email },
     });

     if (!user) throw new Error('User not found');

     // Check if already a member
     const existingMember = await prisma.projectMember.findUnique({
       where: {
         projectId_userId: {
           projectId,
           userId: user.id,
         },
       },
     });

     if (existingMember) {
       // Update role if different
       if (existingMember.role !== role) {
         return prisma.projectMember.update({
           where: { id: existingMember.id },
           data: { role },
         });
       }
       return existingMember;
     }

     // Create new member
     const member = await prisma.projectMember.create({
       data: {
         projectId,
         userId: user.id,
         role,
       },
     });

     // Create notification
     await prisma.notification.create({
       data: {
         userId: user.id,
         type: 'PROJECT_SHARED',
         title: 'Project Shared With You',
         message: `You have been added to a project as a ${role.toLowerCase()}.`,
       },
     });

     return member;
   }

   export async function removeProjectMember(projectId: string, userId: string) {
     return prisma.projectMember.delete({
       where: {
         projectId_userId: {
           projectId,
           userId,
         },
       },
     });
   }
   ```

2. ✅ Create API routes for project sharing
3. ✅ Create project sharing components with database integration

## 9. User Interface & Experience

### 9.1 Dashboard Implementation

1. ✅ Create dashboard page with database integration

   ```typescript
   // app/dashboard/page.tsx
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { redirect } from 'next/navigation';
   import { prisma } from '@/lib/db/prisma';
   import { DashboardLayout } from '@/components/layout/DashboardLayout';
   import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
   import { DocumentList } from '@/components/documents/DocumentList';
   import { ProjectList } from '@/components/projects/ProjectList';

   export default async function DashboardPage() {
     const session = await getServerSession(authOptions);

     if (!session) {
       redirect('/login');
     }

     // Get recent documents
     const recentDocuments = await prisma.document.findMany({
       where: { userId: session.user.id },
       orderBy: { updatedAt: 'desc' },
       take: 5,
     });

     // Get recent projects
     const recentProjects = await prisma.project.findMany({
       where: {
         OR: [
           { userId: session.user.id },
           {
             members: {
               some: {
                 userId: session.user.id,
               },
             },
           },
         ],
         isArchived: false,
       },
       orderBy: { updatedAt: 'desc' },
       take: 3,
     });

     // Get recent analyses
     const recentAnalyses = await prisma.analysis.findMany({
       where: { userId: session.user.id },
       orderBy: { createdAt: 'desc' },
       take: 5,
       include: {
         documents: {
           select: {
             id: true,
             title: true,
           },
         },
       },
     });

     return (
       <DashboardLayout>
         <h1>Dashboard</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <h2>Recent Documents</h2>
             <DocumentList documents={recentDocuments} />
           </div>

           <div>
             <h2>Recent Projects</h2>
             <ProjectList projects={recentProjects} />
           </div>
         </div>

         <div className="mt-8">
           <h2>Recent Activity</h2>
           <ActivityFeed analyses={recentAnalyses} />
         </div>
       </DashboardLayout>
     );
   }
   ```

2. ✅ Create activity feed component with database integration

   ```typescript
   // components/dashboard/ActivityFeed.tsx
   import { formatDistanceToNow } from 'date-fns';
   import Link from 'next/link';

   export function ActivityFeed({ analyses }) {
     if (!analyses.length) {
       return <div>No recent activity</div>;
     }

     return (
       <div className="space-y-4">
         {analyses.map(analysis => (
           <div key={analysis.id} className="border p-4 rounded-lg">
             <div className="flex justify-between">
               <h3>{getAnalysisTitle(analysis)}</h3>
               <span className="text-sm text-gray-500">
                 {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
               </span>
             </div>
             <p>
               {analysis.documents.length > 0 && (
                 <>
                   Document: <Link href={`/documents/${analysis.documents[0].id}`}>
                     {analysis.documents[0].title}
                   </Link>
                 </>
               )}
             </p>
             <div className="mt-2">
               <Link href={`/analysis/${analysis.id}`} className="text-blue-500">
                 View Results
               </Link>
             </div>
           </div>
         ))}
       </div>
     );
   }

   function getAnalysisTitle(analysis) {
     switch (analysis.type) {
       case 'SUMMARY':
         return 'Document Summary';
       case 'EXPLANATION':
         return 'Document Explanation';
       case 'METHODOLOGY':
         return 'Methodology Analysis';
       case 'CLAIMS_EVIDENCE':
         return 'Claims & Evidence Analysis';
       case 'CROSS_DOCUMENT':
         return 'Cross-Document Analysis';
       case 'COMPARISON':
         return 'Document Comparison';
       case 'SWOT':
         return 'SWOT Analysis';
       case 'ETHICAL_IMPACT':
         return 'Ethical Impact Analysis';
       case 'QA':
         return 'Q&A Session';
       default:
         return 'Analysis';
     }
   }
   ```

### 9.2 Document Viewer

1. ✅ Create document viewer component with database integration

   ```typescript
   // components/documents/DocumentViewer.tsx
   import { useEffect, useState } from 'react';
   import { Document, Page, pdfjs } from 'react-pdf';

   // Set up PDF.js worker
   pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

   export function DocumentViewer({ documentId }: { documentId: string }) {
     const [document, setDocument] = useState(null);
     const [numPages, setNumPages] = useState(null);
     const [pageNumber, setPageNumber] = useState(1);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchDocument = async () => {
         try {
           const response = await fetch(`/api/documents/${documentId}`);
           if (!response.ok) throw new Error('Failed to fetch document');

           const data = await response.json();
           setDocument(data);
         } catch (error) {
           console.error('Document fetch failed:', error);
         } finally {
           setLoading(false);
         }
       };

       fetchDocument();
     }, [documentId]);

     const onDocumentLoadSuccess = ({ numPages }) => {
       setNumPages(numPages);
     };

     if (loading) return <div>Loading document...</div>;
     if (!document) return <div>Document not found</div>;

     return (
       <div>
         <div className="mb-4">
           <h1>{document.title}</h1>
           {document.description && <p>{document.description}</p>}
         </div>

         {document.fileType === 'PDF' ? (
           <div className="pdf-container">
             <Document
               file={document.fileUrl}
               onLoadSuccess={onDocumentLoadSuccess}
               loading={<div>Loading PDF...</div>}
             >
               <Page pageNumber={pageNumber} />
             </Document>

             <div className="flex justify-between mt-4">
               <button
                 onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                 disabled={pageNumber <= 1}
               >
                 Previous
               </button>
               <p>
                 Page {pageNumber} of {numPages}
               </p>
               <button
                 onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                 disabled={pageNumber >= numPages}
               >
                 Next
               </button>
             </div>
           </div>
         ) : (
           <div className="text-content">
             <pre>{document.extractedText}</pre>
           </div>
         )}
       </div>
     );
   }
   ```

2. ✅ Create document page with database integration

   ```typescript
   // app/documents/[id]/page.tsx
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { redirect } from 'next/navigation';
   import { prisma } from '@/lib/db/prisma';
   import { DashboardLayout } from '@/components/layout/DashboardLayout';
   import { DocumentViewer } from '@/components/documents/DocumentViewer';
   import { AnalysisOptions } from '@/components/analysis/AnalysisOptions';

   export default async function DocumentPage({ params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);

     if (!session) {
       redirect('/login');
     }

     // Get document
     const document = await prisma.document.findFirst({
       where: {
         id: params.id,
         OR: [
           { userId: session.user.id },
           {
             project: {
               members: {
                 some: {
                   userId: session.user.id,
                 },
               },
             },
           },
         ],
       },
     });

     if (!document) {
       redirect('/dashboard');
     }

     return (
       <DashboardLayout>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
             <DocumentViewer documentId={params.id} />
           </div>

           <div>
             <AnalysisOptions documentId={params.id} />
           </div>
         </div>
       </DashboardLayout>
     );
   }
   ```

### 9.3 Analysis Results Viewer

1. ✅ Create analysis results component with database integration

   ```typescript
   // components/analysis/AnalysisResults.tsx
   import { useEffect, useState } from 'react';

   export function AnalysisResults({ analysisId }: { analysisId: string }) {
     const [analysis, setAnalysis] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchAnalysis = async () => {
         try {
           const response = await fetch(`/api/analysis/${analysisId}`);
           if (!response.ok) throw new Error('Failed to fetch analysis');

           const data = await response.json();
           setAnalysis(data);
         } catch (error) {
           console.error('Analysis fetch failed:', error);
         } finally {
           setLoading(false);
         }
       };

       fetchAnalysis();
     }, [analysisId]);

     if (loading) return <div>Loading analysis results...</div>;
     if (!analysis) return <div>Analysis not found</div>;

     // Render different components based on analysis type
     switch (analysis.type) {
       case 'SUMMARY':
         return <SummaryResults analysis={analysis} />;
       case 'EXPLANATION':
         return <ExplanationResults analysis={analysis} />;
       case 'METHODOLOGY':
         return <MethodologyResults analysis={analysis} />;
       case 'CLAIMS_EVIDENCE':
         return <ClaimsResults analysis={analysis} />;
       case 'CROSS_DOCUMENT':
         return <CrossDocumentResults analysis={analysis} />;
       case 'COMPARISON':
         return <ComparisonResults analysis={analysis} />;
       case 'SWOT':
         return <SwotResults analysis={analysis} />;
       case 'ETHICAL_IMPACT':
         return <EthicalResults analysis={analysis} />;
       default:
         return <GenericResults analysis={analysis} />;
     }
   }

   // Implement each result component type
   function SummaryResults({ analysis }) {
     return (
       <div>
         <h2>Summary</h2>
         <div className="mt-4">
           {analysis.result.summary}
         </div>
       </div>
     );
   }

   // Additional result components...
   ```

2. ✅ Create analysis page with database integration

   ```typescript
   // app/analysis/[id]/page.tsx
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/app/api/auth/[...nextauth]/route';
   import { redirect } from 'next/navigation';
   import { prisma } from '@/lib/db/prisma';
   import { DashboardLayout } from '@/components/layout/DashboardLayout';
   import { AnalysisResults } from '@/components/analysis/AnalysisResults';

   export default async function AnalysisPage({ params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);

     if (!session) {
       redirect('/login');
     }

     // Get analysis
     const analysis = await prisma.analysis.findFirst({
       where: {
         id: params.id,
         userId: session.user.id,
       },
       include: {
         documents: {
           select: {
             id: true,
             title: true,
           },
         },
       },
     });

     if (!analysis) {
       redirect('/dashboard');
     }

     return (
       <DashboardLayout>
         <div>
           <h1>{getAnalysisTitle(analysis)}</h1>

           <div className="mt-2 text-sm">
             {analysis.documents.map(doc => (
               <span key={doc.id} className="mr-2">
                 Document: <a href={`/documents/${doc.id}`} className="text-blue-500">{doc.title}</a>
               </span>
             ))}
           </div>

           <div className="mt-6">
             <AnalysisResults analysisId={params.id} />
           </div>
         </div>
       </DashboardLayout>
     );
   }

   function getAnalysisTitle(analysis) {
     // Same implementation as in ActivityFeed
   }
   ```

## 10. Deployment & Production Setup

### 10.1 Environment Configuration

1. ✅ Create production environment variables

   ```
   # .env.production

   # App
   NEXT_PUBLIC_APP_URL=https://academialens.com

   # Database
   DATABASE_URL=postgresql://user:password@production-db-host:5432/academialens

   # Authentication
   NEXTAUTH_URL=https://academialens.com
   NEXTAUTH_SECRET=your-production-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Storage
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # AI
   GEMINI_API_KEY=your-gemini-api-key
   ```

2. ✅ Configure database connection pooling

   ```typescript
   // lib/db/prisma.ts
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = global as unknown as { prisma: PrismaClient };

   export const prisma =
     globalForPrisma.prisma ||
     new PrismaClient({
       log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
       datasources: {
         db: {
           url: process.env.DATABASE_URL,
         },
       },
       // Connection pooling configuration
       connection: {
         pool: {
           min: 2,
           max: 10,
         },
       },
     });

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

### 10.2 Performance Optimization

1. ✅ Implement API response caching

   ```typescript
   // lib/cache.ts
   import { Redis } from '@upstash/redis';

   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_URL,
     token: process.env.UPSTASH_REDIS_TOKEN,
   });

   export async function getCachedData(key: string) {
     return redis.get(key);
   }

   export async function setCachedData(key: string, data: any, expirationInSeconds = 3600) {
     return redis.set(key, data, { ex: expirationInSeconds });
   }

   export async function invalidateCache(key: string) {
     return redis.del(key);
   }
   ```

2. ✅ Implement database query optimization

   ```typescript
   // Example of optimized query in projectService.ts
   export async function getProjectsOptimized(userId: string) {
     // Use raw SQL for better performance on large datasets
     const projects = await prisma.$queryRaw`
       SELECT 
         p.id, p.name, p.description, p.created_at, p.updated_at,
         u.name as owner_name, u.email as owner_email,
         COUNT(DISTINCT d.id) as document_count,
         COUNT(DISTINCT a.id) as analysis_count
       FROM "Project" p
       JOIN "User" u ON p.user_id = u.id
       LEFT JOIN "Document" d ON d.project_id = p.id
       LEFT JOIN "Analysis" a ON a.project_id = p.id
       WHERE 
         (p.user_id = ${userId} OR 
          EXISTS (SELECT 1 FROM "ProjectMember" pm WHERE pm.project_id = p.id AND pm.user_id = ${userId}))
         AND p.is_archived = false
       GROUP BY p.id, u.id
       ORDER BY p.updated_at DESC
     `;

     return projects;
   }
   ```

## 11. Testing & Quality Assurance

### 11.1 Unit Testing

1. ✅ Set up Jest for testing
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
   ```
2. ✅ Create test for document service

   ```typescript
   // __tests__/lib/documents/documentService.test.ts
   import { deleteDocument } from '@/lib/documents/documentService';
   import { prisma } from '@/lib/db/prisma';
   import { deleteFromCloudinary } from '@/lib/storage/cloudinary';

   // Mock dependencies
   jest.mock('@/lib/db/prisma', () => ({
     prisma: {
       document: {
         findFirst: jest.fn(),
         delete: jest.fn(),
       },
     },
   }));

   jest.mock('@/lib/storage/cloudinary', () => ({
     deleteFromCloudinary: jest.fn(),
   }));

   describe('documentService', () => {
     describe('deleteDocument', () => {
       it('should throw an error if document not found', async () => {
         // Mock document not found
         prisma.document.findFirst.mockResolvedValue(null);

         await expect(deleteDocument('doc-id', 'user-id')).rejects.toThrow(
           'Document not found or access denied',
         );
       });

       it('should delete document from storage and database', async () => {
         // Mock document found
         prisma.document.findFirst.mockResolvedValue({
           id: 'doc-id',
           fileUrl: 'cloudinary://test',
         });

         // Mock successful deletion
         deleteFromCloudinary.mockResolvedValue(undefined);
         prisma.document.delete.mockResolvedValue({ id: 'doc-id' });

         await deleteDocument('doc-id', 'user-id');

         expect(deleteFromCloudinary).toHaveBeenCalled();
         expect(prisma.document.delete).toHaveBeenCalledWith({
           where: { id: 'doc-id' },
         });
       });
     });
   });
   ```

### 11.2 Integration Testing

1. ✅ Create API route test

   ```typescript
   // __tests__/app/api/documents/route.test.ts
   import { POST } from '@/app/api/documents/route';
   import { getServerSession } from 'next-auth';
   import { storeDocument } from '@/lib/storage/documentStorage';

   // Mock dependencies
   jest.mock('next-auth', () => ({
     getServerSession: jest.fn(),
   }));

   jest.mock('@/lib/storage/documentStorage', () => ({
     storeDocument: jest.fn(),
   }));

   describe('Documents API', () => {
     describe('POST /api/documents', () => {
       it('should return 401 if not authenticated', async () => {
         // Mock unauthenticated session
         getServerSession.mockResolvedValue(null);

         const request = new Request('http://localhost/api/documents', {
           method: 'POST',
         });

         const response = await POST(request);
         expect(response.status).toBe(401);

         const data = await response.json();
         expect(data.error).toBe('Unauthorized');
       });

       it('should create document if authenticated', async () => {
         // Mock authenticated session
         getServerSession.mockResolvedValue({
           user: { id: 'user-id' },
         });

         // Mock FormData
         const formData = new FormData();
         const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
         formData.append('file', file);

         // Mock successful document creation
         storeDocument.mockResolvedValue({
           id: 'doc-id',
           title: 'test.pdf',
         });

         const request = new Request('http://localhost/api/documents', {
           method: 'POST',
           body: formData,
         });

         const response = await POST(request);
         expect(response.status).toBe(200);

         const data = await response.json();
         expect(data.id).toBe('doc-id');
       });
     });
   });
   ```

## Conclusion

This document provides precise, small, actionable tasks for systematically building the AcademiaLens application, with special focus on database and storage integration throughout all modules. Each task is designed to be modular and independently completable, providing a clear path for efficient development.

The tasks cover all aspects of the application, from project setup and infrastructure to the implementation of each module, user interface, and deployment considerations. By following this task list, you can systematically build a polished and feature-complete product that meets all the requirements specified in the original report.

Key aspects addressed in these tasks:

1. Database integration with Prisma ORM
2. Storage integration with Cloudinary
3. Gemini AI integration with database tracking
4. Vector search implementation for semantic retrieval
5. User authentication and authorization
6. Document processing and analysis
7. Project management and collaboration
8. User interface and experience
9. Performance optimization and testing

By completing these tasks in order, you will create a modular, scalable, and maintainable application that provides significant value to researchers and academic professionals.
