# AcademiaLens Flow Diagrams

This document provides detailed flow diagrams for key processes in the AcademiaLens application, illustrating the interactions between components, services, and user actions.

## 1. Document Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Document Processing Flow                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │  Upload  │     │ Document │     │ Processing│     │ Storage  │
│          │     │ Component│     │ Service  │     │ Service   │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Select File    │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Upload File    │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Store File     │                │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ File URL       │                │
     │                │                │                │                │
     │                │                │ Create Document│                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Process Document                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ Extract Text   │
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │                │ Extract Metadata
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │                │ Create Chunks  │
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │                │ Generate       │
     │                │                │                │ Embeddings     │
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │                │ Extract Entities│
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ Processing     │                │
     │                │                │ Complete       │                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Update UI      │                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Document  │                │                │                │
     │ Ready          │                │                │                │
     │                │                │                │                │
```

### Process Description:

1. **Document Upload**

   - User selects a file (PDF, text, URL, etc.)
   - Upload component sends file to Document Service
   - File is stored in cloud storage (Cloudinary)
   - Document record is created in database

2. **Document Processing**

   - Processing Service extracts text from the document
   - For PDFs, OCR is applied if needed
   - Metadata is extracted (authors, publication date, etc.)
   - Document is split into chunks for efficient processing
   - Vector embeddings are generated for each chunk
   - Named entities are extracted and categorized

3. **Completion**
   - Document status is updated to "processed"
   - UI is updated to show document is ready for analysis
   - User is notified of completion

## 2. AI Analysis Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI Analysis Flow                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Analysis │     │   AI     │     │  Gemini  │     │ Database │
│          │     │ Component│     │ Service  │     │   API    │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Select Analysis│                │                │                │
     │ Type & Options │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Request Analysis                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Create Analysis Record          │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Analysis ID    │                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Analysis Started                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Loading   │                │                │                │
     │                │                │                │                │
     │                │                │ Retrieve Document Content       │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Document Content│                │
     │                │                │                │                │
     │                │                │ Generate Prompt│                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Send Prompt    │                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ Process Prompt │
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ AI Response    │                │
     │                │                │                │                │
     │                │                │ Process Response                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Extract Citations                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Format Results │                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Save Results   │                │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Confirmation   │                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Analysis Complete               │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Results   │                │                │                │
     │                │                │                │                │
```

### Process Description:

1. **Analysis Initiation**

   - User selects analysis type (summary, methodology extraction, etc.)
   - User configures analysis options (length, focus, etc.)
   - Analysis request is sent to AI Service
   - Analysis record is created in database with "pending" status

2. **AI Processing**

   - AI Service retrieves document content from database
   - Appropriate prompt is generated based on analysis type and options
   - Prompt is sent to Gemini API
   - Response is received from Gemini API

3. **Result Processing**

   - AI Service processes the response
   - Citations are extracted and linked to source material
   - Results are formatted according to analysis type
   - Analysis record is updated with results and "completed" status

4. **Completion**
   - UI is updated to show analysis results
   - User can view, export, or further interact with results

## 3. User Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      User Authentication Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │  Auth    │     │ NextAuth │     │  OAuth   │     │ Database │
│          │     │ Component│     │ Service  │     │ Provider │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Click Sign In  │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Initiate Auth  │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Redirect to Provider            │
     │                │<───────────────│                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Redirect to    │                │                │                │
     │ Provider       │                │                │                │
     │                │                │                │                │
     │ Authenticate   │                │                │                │
     │ with Provider  │                │                │                │
     │───────────────────────────────────────────────>│                │
     │                │                │                │                │
     │<──────────────────────────────────────────────│                │
     │ Redirect to    │                │                │                │
     │ Callback URL   │                │                │                │
     │                │                │                │                │
     │ Callback with  │                │                │                │
     │ Auth Code      │                │                │                │
     │───────────────────────────────>│                │                │
     │                │                │                │                │
     │                │                │ Exchange Code  │                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ Access Token   │                │
     │                │                │                │                │
     │                │                │ Get User Profile                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ User Profile   │                │
     │                │                │                │                │
     │                │                │ Find or Create User             │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ User Record    │                │
     │                │                │                │                │
     │                │                │ Create Session │                │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Session ID     │                │
     │                │                │                │                │
     │<───────────────────────────────│                │                │
     │ Redirect to    │                │                │                │
     │ Dashboard      │                │                │                │
     │                │                │                │                │
```

### Process Description:

1. **Authentication Initiation**

   - User clicks "Sign In" button
   - Auth component initiates authentication process
   - NextAuth redirects user to selected OAuth provider

2. **Provider Authentication**

   - User authenticates with OAuth provider (Google, Microsoft, etc.)
   - Provider redirects back to application with auth code
   - NextAuth exchanges code for access token
   - User profile is retrieved from provider

3. **User Creation/Retrieval**

   - NextAuth checks if user exists in database
   - If not, new user record is created
   - Session is created and stored in database
   - Session cookie is set in browser

4. **Completion**
   - User is redirected to dashboard
   - Application is now in authenticated state

## 4. Cross-Document Analysis Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Cross-Document Analysis Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Document │     │ Analysis │     │   AI     │     │ Vector   │
│          │     │ Selection│     │ Service  │     │ Service  │     │ Database │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Select Multiple│                │                │                │
     │ Documents      │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │ Select Analysis│                │                │                │
     │ Type           │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Request Cross-Doc Analysis      │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Create Analysis Record          │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Analysis Started│                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Loading   │                │                │                │
     │                │                │                │                │
     │                │                │ Find Semantic Similarities      │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Similar Chunks │                │
     │                │                │                │                │
     │                │                │ Retrieve Document Content       │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Generate Cross-Doc Prompt       │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Process with AI│                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ Generate       │
     │                │                │                │ Insights       │
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ AI Results     │                │
     │                │                │                │                │
     │                │                │ Process Results│                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Generate Visualizations         │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Save Results   │                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Analysis Complete               │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Results   │                │                │                │
     │ & Visualizations                │                │                │
     │                │                │                │                │
```

### Process Description:

1. **Document Selection**

   - User selects multiple documents for comparison
   - User chooses analysis type (consensus/conflict, knowledge gaps, etc.)
   - Request is sent to Analysis Service

2. **Semantic Analysis**

   - Vector Database is queried to find semantic similarities between documents
   - Similar chunks are identified across documents
   - Document content is retrieved for processing

3. **AI Processing**

   - Cross-document analysis prompt is generated
   - AI Service processes the documents with Gemini API
   - Results are processed and structured
   - Visualizations are generated (concept maps, comparison tables, etc.)

4. **Completion**
   - Results are saved to database
   - UI is updated to show cross-document insights and visualizations

## 5. Project Collaboration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Project Collaboration Flow                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Owner   │     │ Project  │     │ Sharing  │     │ Notification│   │Collaborator│
│  User    │     │ Service  │     │ Service  │     │ Service   │     │  User    │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Open Project   │                │                │                │
     │ Settings       │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │ Add Collaborator                │                │                │
     │ (email, role)  │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Share Project  │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Check if User Exists            │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Create Project Member Record    │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Create Notification             │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ Send Email     │
     │                │                │                │───────────────>│
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Sharing Complete                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Confirmation   │                │                │                │
     │                │                │                │                │
     │                │                │                │                │
     │                │                │                │                │
     │                │                │                │ User Logs In   │
     │                │                │                │<───────────────│
     │                │                │                │                │
     │                │                │                │ See Notification
     │                │                │                │<───────────────│
     │                │                │                │                │
     │                │ Access Project │                │                │
     │                │<───────────────────────────────────────────────│
     │                │                │                │                │
     │                │ Load Project   │                │                │
     │                │ with Role      │                │                │
     │                │ Permissions    │                │                │
     │                │────────────────┐                │                │
     │                │                │                │                │
     │                │<───────────────┘                │                │
     │                │                │                │                │
     │                │ Project Data   │                │                │
     │                │───────────────────────────────────────────────>│
     │                │                │                │                │
```

### Process Description:

1. **Sharing Initiation**

   - Project owner opens project settings
   - Owner enters collaborator's email and assigns role (viewer, editor)
   - Request is sent to Project Service

2. **Collaboration Setup**

   - Sharing Service checks if user exists
   - If user exists, ProjectMember record is created
   - If user doesn't exist, invitation is created
   - Notification is created and email is sent

3. **Collaborator Access**
   - Collaborator receives notification
   - Collaborator logs in and accesses shared project
   - Project is loaded with appropriate permissions based on role
   - Collaborator can view or edit project based on assigned role

## 6. Question & Answer Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Question & Answer Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │   Q&A    │     │   RAG    │     │   AI     │     │ Vector   │
│          │     │ Component│     │ Service  │     │ Service  │     │ Database │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Ask Question  │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Send Question  │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Create Embedding                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Search Similar Chunks           │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Relevant Chunks│                │
     │                │                │                │                │
     │                │                │ Generate RAG Prompt             │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Process with AI│                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ Generate Answer│
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ AI Response    │                │
     │                │                │                │                │
     │                │                │ Extract Citations                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Format Answer  │                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Answer with    │                │                │
     │                │ Citations      │                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Display Answer │                │                │                │
     │ with Source    │                │                │                │
     │ References     │                │                │                │
     │                │                │                │                │
     │ Ask Follow-up  │                │                │                │
     │ Question       │                │                │                │
     │───────────────>│                │                │                │
     │                │ Send Question  │                │                │
     │                │ with Context   │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Process with   │                │
     │                │                │ Conversation   │                │
     │                │                │ History        │                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ ... (repeat process) ...        │
     │                │                │                │                │
```

### Process Description:

1. **Question Input**

   - User asks a question about document content
   - Question is sent to RAG (Retrieval-Augmented Generation) Service

2. **Context Retrieval**

   - Question is converted to vector embedding
   - Vector Database is queried to find relevant document chunks
   - Most relevant chunks are retrieved as context

3. **Answer Generation**

   - RAG prompt is generated with question and retrieved context
   - AI Service processes the prompt with Gemini API
   - Citations are extracted from the response
   - Answer is formatted with source references

4. **Conversation Continuation**
   - User can ask follow-up questions
   - Conversation history is maintained for context
   - Process repeats with additional context from previous interactions

## 7. Subscription Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Subscription Management Flow                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Pricing  │     │ Checkout │     │  Stripe  │     │ Database │
│          │     │   Page   │     │ Service  │     │  API     │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ View Pricing   │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │ Select Plan    │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Create Checkout│                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Create Checkout Session         │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ Session ID     │                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Redirect URL   │                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Redirect to    │                │                │                │
     │ Stripe Checkout│                │                │                │
     │                │                │                │                │
     │ Enter Payment  │                │                │                │
     │ Details        │                │                │                │
     │───────────────────────────────────────────────>│                │
     │                │                │                │                │
     │<──────────────────────────────────────────────│                │
     │ Redirect to    │                │                │                │
     │ Success URL    │                │                │                │
     │                │                │                │                │
     │                │                │                │ Webhook Event  │
     │                │                │                │ (checkout.session.completed)
     │                │                │<───────────────│                │
     │                │                │                │                │
     │                │                │ Verify Event   │                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Update User Subscription        │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Confirmation   │                │
     │                │                │                │                │
     │ View Dashboard │                │                │                │
     │ with New Plan  │                │                │                │
     │ Features       │                │                │                │
     │                │                │                │                │
```

### Process Description:

1. **Plan Selection**

   - User views pricing page with available plans
   - User selects desired subscription plan
   - Request is sent to Checkout Service

2. **Checkout Process**

   - Checkout Service creates Stripe Checkout Session
   - User is redirected to Stripe Checkout page
   - User enters payment details and completes purchase
   - Stripe redirects user back to application success page

3. **Subscription Activation**
   - Stripe sends webhook event to application
   - Checkout Service verifies webhook signature
   - User subscription is updated in database
   - User gains access to plan features

## 8. Document Comparison Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Document Comparison Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Comparison│     │ Analysis │     │   AI     │     │Visualization│
│          │     │ Component │     │ Service  │     │ Service  │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Select Two     │                │                │                │
     │ Documents      │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │ Select Comparison               │                │                │
     │ Aspects        │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ Request Comparison              │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │                │ Create Analysis Record          │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Analysis Started│                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Loading   │                │                │                │
     │                │                │                │                │
     │                │                │ Retrieve Documents              │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Generate Comparison Prompt      │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │                │ Process with AI│                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ Generate       │
     │                │                │                │ Comparison     │
     │                │                │                │────────────────┐
     │                │                │                │                │
     │                │                │                │<───────────────┘
     │                │                │                │                │
     │                │                │<───────────────│                │
     │                │                │ Comparison Data│                │
     │                │                │                │                │
     │                │                │ Generate Comparison Table       │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │                │<───────────────────────────────│
     │                │                │ Visualization  │                │
     │                │                │ Components     │                │
     │                │                │                │                │
     │                │                │ Save Results   │                │
     │                │                │────────────────┐                │
     │                │                │                │                │
     │                │                │<───────────────┘                │
     │                │                │                │                │
     │                │<───────────────│                │                │
     │                │ Comparison     │                │                │
     │                │ Complete       │                │                │
     │                │                │                │                │
     │<───────────────│                │                │                │
     │ Show Comparison│                │                │                │
     │ Table & Insights                │                │                │
     │                │                │                │                │
```

### Process Description:

1. **Document Selection**

   - User selects two documents to compare
   - User specifies comparison aspects (methodology, findings, etc.)
   - Request is sent to Analysis Service

2. **Comparison Processing**

   - Analysis Service retrieves document content
   - Comparison prompt is generated with specified aspects
   - AI Service processes the documents with Gemini API
   - Structured comparison data is generated

3. **Visualization**

   - Visualization Service generates comparison table
   - Similarities and differences are highlighted
   - Results are saved to database

4. **Completion**
   - UI is updated to show comparison table and insights
   - User can interact with comparison results

## Conclusion

These flow diagrams illustrate the key processes in the AcademiaLens application, showing the interactions between components, services, and external APIs. The diagrams provide a clear understanding of how data flows through the system and how different parts of the application work together to deliver the core functionality.

The modular architecture allows for independent scaling and development of each service, while maintaining clear communication patterns between components. This approach supports the application's requirements for performance, maintainability, and extensibility.
