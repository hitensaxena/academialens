'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: 'processing' | 'completed' | 'failed';
  processedAt?: string;
  error?: string;
  chunks?: {
    id: string;
    pages: {
      content: string;
      pageNumber?: number;
      metadata: Record<string, unknown>;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

// Interface removed as it's not being used

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UploadScreen() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingStatus, setProcessingStatus] = useState<Record<string, string>>({});

  // Fetch documents on component mount
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize fetch on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Poll document processing status
  const pollDocumentStatus = useCallback(
    async (docId: string) => {
      const poll = async () => {
        try {
          const response = await fetch(`/api/documents/${docId}/status`);
          if (!response.ok) throw new Error('Failed to fetch status');

          const data = await response.json();

          // Update status in UI
          if (data.status === 'processing') {
            setProcessingStatus(prev => ({
              ...prev,
              [docId]: data.message || 'Processing...',
            }));

            // Continue polling if still processing
            if (data.estimatedTimeRemaining) {
              setTimeout(poll, 5000);
            }
          } else {
            // Processing complete or failed
            setDocuments(prev => prev.map(doc => (doc.id === docId ? { ...doc, ...data } : doc)));

            if (data.status === 'completed') {
              setProcessingStatus(prev => ({
                ...prev,
                [docId]: 'Processing complete',
              }));
              setSuccess(`Document "${data.title}" processed successfully`);
            } else if (data.status === 'failed') {
              setProcessingStatus(prev => ({
                ...prev,
                [docId]: `Failed: ${data.error || 'Unknown error'}`,
              }));
              setError(`Failed to process document: ${data.error || 'Unknown error'}`);
            }

            // Refresh documents list
            await fetchDocuments();
          }
        } catch (error) {
          console.error('Error polling document status:', error);
          // Don't show error to user, just stop polling
        }
      };

      // Start polling
      poll();
    },
    [fetchDocuments],
  );

  // Handle upload errors
  const handleUploadError = useCallback((error: unknown, defaultMessage: string) => {
    console.error('Upload error:', error);
    setUploading(false);
    setProcessing(false);

    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    setError(errorMessage);

    // Update document status if we have a temp ID
    setDocuments(prev =>
      prev.map(doc =>
        doc.id.startsWith('temp-') ? { ...doc, status: 'failed', error: errorMessage } : doc,
      ),
    );
  }, []);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setSuccess(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  // Show error for rejected files
  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File is too large. Maximum size is 20MB.');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      } else {
        setError('Error processing file. Please try again.');
      }
    }
  }, [fileRejections]);

  // Handle file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    // Create a document entry immediately to show in the UI
    const tempDocId = `temp-${Date.now()}`;
    const newDoc: Document = {
      id: tempDocId,
      title: file.name,
      fileUrl: '',
      fileType: file.type,
      fileSize: file.size,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments(prev => [newDoc, ...prev]);
    setProcessingStatus(prev => ({
      ...prev,
      [tempDocId]: 'Uploading file...',
    }));

    try {
      // Create a new XMLHttpRequest for better progress tracking
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
          setProcessingStatus(prev => ({
            ...prev,
            [tempDocId]: `Uploading: ${percentComplete}%`,
          }));
        }
      };

      // Set up the request
      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('Accept', 'application/json');

      // Handle response
      xhr.onload = async () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const responseData = JSON.parse(xhr.responseText);
            console.log('Upload successful:', responseData);

            // Update the document with server response
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === tempDocId ? { ...responseData, status: 'processing' as const } : doc,
              ),
            );

            setProcessingStatus(prev => ({
              ...prev,
              [tempDocId]: 'Processing document...',
            }));

            // Start polling for processing status
            pollDocumentStatus(responseData.id);
          } else {
            // Try to parse error response
            let errorMessage = xhr.statusText;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.error || errorData.message || errorMessage;
              if (errorData.details) {
                errorMessage += `: ${errorData.details}`;
              }
            } catch (e) {
              // If we can't parse the error, use the status text
              console.error('Error parsing error response:', e);
            }

            handleUploadError(
              new Error(errorMessage),
              `Upload failed with status ${xhr.status}: ${errorMessage}`,
            );
          }
        } catch (error) {
          console.error('Error in upload response handler:', error);
          handleUploadError(
            error,
            'Failed to process server response. Please check the console for details.',
          );
        }
      };

      // Handle network errors
      xhr.onerror = () => {
        handleUploadError(
          new Error('Network error'),
          'Failed to connect to server. Please check your internet connection and try again.',
        );
      };

      // Set timeout
      const timeoutId = setTimeout(() => {
        xhr.abort();
        handleUploadError(new Error('Request timeout'), 'Upload timed out');
      }, 300000); // 5 minute timeout

      // Send the request
      xhr.send(formData);

      // Cleanup timeout on unmount or completion
      return () => clearTimeout(timeoutId);
    } catch (error) {
      handleUploadError(error, 'An error occurred during upload');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  // Render document status
  const renderDocumentStatus = (doc: Document) => {
    const status = processingStatus[doc.id] || '';
    const isProcessing = doc.status === 'processing';
    const isCompleted = doc.status === 'completed';
    const isFailed = doc.status === 'failed';

    return (
      <div className="mt-1 text-sm">
        {isProcessing && (
          <div className="flex items-center text-yellow-600">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{status || 'Processing...'}</span>
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Ready for analysis</span>
          </div>
        )}
        {isFailed && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>{doc.error || 'Processing failed'}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload a PDF, DOCX, or text file to process and analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 20MB)</p>
              </div>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {uploading && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground text-center">
                      Uploading... {progress}%
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={!file || uploading || processing}
                className="w-full sm:w-auto"
              >
                {uploading || processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploading ? 'Uploading...' : 'Processing...'}
                  </>
                ) : (
                  'Upload Document'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
              <p className="text-sm">{success}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>View and manage your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(doc.fileSize)} •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      {renderDocumentStatus(doc)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {doc.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/documents/${doc.id}`)}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
