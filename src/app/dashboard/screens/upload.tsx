'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Loader2, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface FetchError extends Error {
  code?: string;
  status?: number;
  statusText?: string;
  response?: any;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UploadScreen() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      console.log('Starting file upload...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        clearTimeout(timeoutId);

        console.log('Upload response status:', response.status, response.statusText);

        let responseData;
        try {
          const responseText = await response.text();
          console.log('Raw response:', responseText);
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Invalid response from server - not valid JSON');
        }

        if (!response.ok) {
          console.error('Upload failed:', {
            status: response.status,
            statusText: response.statusText,
            response: responseData,
            headers: Object.fromEntries(response.headers.entries()),
          });

          // Handle specific error statuses
          if (response.status === 401) {
            throw new Error('Please sign in to upload files');
          } else if (response.status === 413) {
            throw new Error('File is too large. Maximum size is 20MB.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          }

          throw new Error(
            responseData.error ||
              responseData.message ||
              `Upload failed with status ${response.status}: ${response.statusText}`,
          );
        }

        console.log('Upload successful:', responseData);
        setSuccess('File uploaded successfully!');
        setFile(null);

        // Refresh the documents list
        await fetchDocuments();
      } catch (error) {
        const fetchError = error as FetchError;

        // Log error details safely
        const errorDetails = {
          name: fetchError.name || 'UnknownError',
          message: fetchError.message || 'No error message',
          stack: 'stack' in fetchError ? fetchError.stack : 'No stack trace',
          code: 'code' in fetchError ? fetchError.code : 'No error code',
          type: typeof fetchError,
        };

        console.error('Fetch error details:', errorDetails);

        // Handle specific error types
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. The server took too long to respond.');
        }

        if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
          throw new Error(
            'Failed to connect to the server. Please check your internet connection.',
          );
        }

        // Re-throw the original error if it's already an Error instance
        if (error instanceof Error) {
          throw error;
        }

        // If we get here, it's an unknown error type
        throw new Error('An unknown error occurred during upload');
      }
    } catch (err) {
      console.error('Upload error:', {
        error: err,
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : 'No message',
        stack: err instanceof Error ? err.stack : 'No stack trace',
      });

      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'An unknown error occurred during upload';

      setError(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setSuccess('Document deleted successfully');
      await fetchDocuments();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete document');
    }
  };

  // Handle document download
  const handleDownloadDocument = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload a PDF, Word, or Text document to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drag and drop a file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOCX, TXT (max 20MB)
                </p>
              </div>
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 rounded-md">
                <CheckCircle2 className="h-4 w-4" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={!file || uploading} className="min-w-[120px]">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Document'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>View and manage your uploaded documents</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDocuments} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No documents uploaded yet.</div>
          ) : (
            <div className="border rounded-md divide-y">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.fileSize)} •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc.fileUrl, doc.title)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
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
