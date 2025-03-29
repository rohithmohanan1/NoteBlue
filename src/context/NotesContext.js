import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Storage from '../utils/storage';

const NotesContext = createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Ideas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notes from storage on startup
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const storedNotes = await Storage.getNotes();
        const storedCategories = await Storage.getCategories();
        
        if (storedNotes) setNotes(storedNotes);
        if (storedCategories) setCategories(storedCategories);
      } catch (e) {
        setError('Failed to load notes: ' + e.message);
        console.error('Failed to load notes:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    if (!loading) {
      Storage.saveNotes(notes);
    }
  }, [notes, loading]);

  // Save categories whenever they change
  useEffect(() => {
    if (!loading) {
      Storage.saveCategories(categories);
    }
  }, [categories, loading]);

  // Add a new note
  const addNote = async (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
    return newNote;
  };

  // Update an existing note
  const updateNote = (id, updatedNote) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { 
              ...note, 
              ...updatedNote, 
              updatedAt: new Date().toISOString() 
            }
          : note
      )
    );
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  // Add a new category
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories(prevCategories => [...prevCategories, category]);
      return true;
    }
    return false;
  };

  // Delete a category
  const deleteCategory = (category) => {
    setCategories(prevCategories => 
      prevCategories.filter(cat => cat !== category)
    );
    
    // Update notes that had this category
    setNotes(prevNotes =>
      prevNotes.map(note => {
        if (note.category === category) {
          return { ...note, category: '' };
        }
        return note;
      })
    );
  };

  const value = {
    notes,
    categories,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    addCategory,
    deleteCategory,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
