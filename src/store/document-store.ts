import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document } from '@prisma/client';

type DocumentState = {
  // Current document state
  currentDocument: Document | null;
  setCurrentDocument: (document: Document | null) => void;

  // Document list
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;

  // Document filters and sorting
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Document selection
  selectedDocumentIds: string[];
  toggleDocumentSelection: (id: string) => void;
  clearSelection: () => void;
  selectAllDocuments: (select: boolean) => void;

  // UI state
  isUploading: boolean;
  setUploading: (isUploading: boolean) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
};

export const useDocumentStore = create<DocumentState>()(
  persist(
    set => ({
      // Current document
      currentDocument: null,
      setCurrentDocument: document => set({ currentDocument: document }),

      // Document list
      documents: [],
      setDocuments: documents => set({ documents }),
      addDocument: document =>
        set(state => ({
          documents: [document, ...state.documents],
        })),
      updateDocument: (id, updates) =>
        set(state => ({
          documents: state.documents.map(doc => (doc.id === id ? { ...doc, ...updates } : doc)),
        })),
      removeDocument: id =>
        set(state => ({
          documents: state.documents.filter(doc => doc.id !== id),
          selectedDocumentIds: state.selectedDocumentIds.filter(docId => docId !== id),
        })),

      // Search
      searchQuery: '',
      setSearchQuery: query => set({ searchQuery: query }),

      // Selection
      selectedDocumentIds: [],
      toggleDocumentSelection: id =>
        set(state => ({
          selectedDocumentIds: state.selectedDocumentIds.includes(id)
            ? state.selectedDocumentIds.filter(docId => docId !== id)
            : [...state.selectedDocumentIds, id],
        })),
      clearSelection: () => set({ selectedDocumentIds: [] }),
      selectAllDocuments: select =>
        set(state => ({
          selectedDocumentIds: select ? state.documents.map(doc => doc.id) : [],
        })),

      // UI state
      isUploading: false,
      setUploading: isUploading => set({ isUploading }),
      uploadProgress: 0,
      setUploadProgress: progress => set({ uploadProgress: progress }),
    }),
    {
      name: 'document-storage',
      // Don't persist the UI state
      partialize: state => ({
        currentDocument: state.currentDocument,
        documents: state.documents,
        searchQuery: state.searchQuery,
      }),
    },
  ),
);

// Helper function to get filtered and sorted documents
export const getFilteredDocuments = (state: DocumentState) => {
  const { documents, searchQuery } = state;

  if (!searchQuery.trim()) {
    return documents;
  }

  const query = searchQuery.toLowerCase();
  return documents.filter(
    doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.fileType.toLowerCase().includes(query),
  );
};
