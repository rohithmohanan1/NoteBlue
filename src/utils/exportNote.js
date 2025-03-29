import { Platform, Share } from 'react-native';

/**
 * Export a note to be shared
 * @param {Object} note - Note object to export
 * @returns {Promise<void>}
 */
export const exportNote = async (note) => {
  try {
    // Format text content
    const formatContent = (content) => {
      // Replace markdown-style formatting with plain text
      return content
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
        .replace(/_(.*?)_/g, '$1')       // Remove italic markers
        .replace(/\n[•□] /g, '\n- ')     // Standardize bullet points
        .replace(/\n\d+\. /g, '\n- ');   // Standardize numbered lists
    };

    // Create formatted note text
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    const noteText = `${note.title || 'Untitled Note'}\n\n` +
      `${formatContent(note.content)}\n\n` +
      `${note.category ? `Category: ${note.category}\n` : ''}` +
      `Last updated: ${formatDate(note.updatedAt)}`;

    // Share the note
    const result = await Share.share({
      message: noteText,
      title: note.title || 'Untitled Note',
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
        console.log('Shared with activity type:', result.activityType);
      } else {
        // Shared
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error exporting note:', error);
    throw new Error('Failed to export note');
  }
};
