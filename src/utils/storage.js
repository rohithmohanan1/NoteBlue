import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const NOTES_STORAGE_KEY = '@NoteBlue:notes';
const CATEGORIES_STORAGE_KEY = '@NoteBlue:categories';

/**
 * Save notes to AsyncStorage
 * @param {Array} notes - Array of note objects
 */
export const saveNotes = async (notes) => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving notes:', e);
    throw new Error('Failed to save notes');
  }
};

/**
 * Get notes from AsyncStorage
 * @returns {Promise<Array>} - Array of note objects
 */
export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting notes:', e);
    throw new Error('Failed to load notes');
  }
};

/**
 * Save categories to AsyncStorage
 * @param {Array} categories - Array of category strings
 */
export const saveCategories = async (categories) => {
  try {
    const jsonValue = JSON.stringify(categories);
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving categories:', e);
    throw new Error('Failed to save categories');
  }
};

/**
 * Get categories from AsyncStorage
 * @returns {Promise<Array>} - Array of category strings
 */
export const getCategories = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : ['Personal', 'Work', 'Ideas'];
  } catch (e) {
    console.error('Error getting categories:', e);
    throw new Error('Failed to load categories');
  }
};

/**
 * Clear all app data (for debugging)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(NOTES_STORAGE_KEY);
    await AsyncStorage.removeItem(CATEGORIES_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing data:', e);
    throw new Error('Failed to clear data');
  }
};
