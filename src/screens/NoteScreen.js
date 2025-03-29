import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  BackHandler, 
  Platform,
  KeyboardAvoidingView 
} from 'react-native';
import { 
  TextInput, 
  IconButton, 
  Menu, 
  Divider, 
  Dialog, 
  Portal, 
  Button,
  Appbar
} from 'react-native-paper';
import { useNotes } from '../context/NotesContext';
import RichTextEditor from '../components/RichTextEditor';
import CategorySelector from '../components/CategorySelector';
import { exportNote } from '../utils/exportNote';
import colors from '../constants/colors';

const NoteScreen = ({ route, navigation }) => {
  const { noteId, isNew } = route.params || {};
  const { notes, addNote, updateNote, deleteNote, categories } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCategoryDialogVisible, setIsCategoryDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);

  // Load note data if editing an existing note
  useEffect(() => {
    if (!isNew && noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category || '');
      }
    }
  }, [isNew, noteId, notes]);

  // Set up navigation header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {!isNew && (
            <IconButton
              icon="export-variant"
              iconColor={colors.white}
              size={24}
              onPress={handleExport}
            />
          )}
          <IconButton
            icon="dots-vertical"
            iconColor={colors.white}
            size={24}
            onPress={() => setIsMenuVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation, isNew, title, content, category]);

  // Handle Android back button
  useEffect(() => {
    const handleBackPress = () => {
      if (!isSaved) {
        setIsDiscardDialogVisible(true);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [isSaved]);

  // Track changes to determine if note is saved
  useEffect(() => {
    if (isNew) {
      setIsSaved(title === '' && content === '');
    } else if (noteId) {
      const originalNote = notes.find(n => n.id === noteId);
      if (originalNote) {
        setIsSaved(
          title === originalNote.title && 
          content === originalNote.content && 
          category === (originalNote.category || '')
        );
      }
    }
  }, [title, content, category, isNew, noteId, notes]);

  const handleSave = async () => {
    if (title.trim() === '' && content.trim() === '') {
      // Don't save empty notes
      navigation.goBack();
      return;
    }

    try {
      if (isNew) {
        await addNote({
          title: title.trim() || 'Untitled Note',
          content,
          category
        });
      } else {
        updateNote(noteId, {
          title: title.trim() || 'Untitled Note',
          content,
          category
        });
      }
      setIsSaved(true);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note:', error);
      // Could show an error message here
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    deleteNote(noteId);
    setIsDeleteDialogVisible(false);
    navigation.goBack();
  };

  const handleDiscard = () => {
    setIsDiscardDialogVisible(false);
    navigation.goBack();
  };

  const handleExport = async () => {
    try {
      await exportNote({
        title,
        content,
        category,
        updatedAt: new Date().toISOString()
      });
      // Could show a success message here
    } catch (error) {
      console.error('Failed to export note:', error);
      // Could show an error message here
    }
  };

  const handleBackPress = () => {
    if (isSaved) {
      navigation.goBack();
    } else {
      setIsDiscardDialogVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          selectionColor={colors.primary}
          theme={{ colors: { text: colors.textPrimary } }}
        />
        
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => setIsCategoryDialogVisible(true)}
        >
          <Appbar.Content
            title={category || 'No Category'} 
            titleStyle={[
              styles.categoryText, 
              !category && styles.categoryPlaceholder
            ]}
            size="small"
          />
          <Appbar.Action icon="tag-outline" color={colors.textSecondary} />
        </TouchableOpacity>
        
        <RichTextEditor
          value={content}
          onChange={setContent}
          style={styles.contentInput}
        />
      </ScrollView>

      <Appbar style={styles.bottomBar}>
        <Appbar.Action icon="keyboard-backspace" onPress={handleBackPress} />
        <Appbar.Content title={isSaved ? 'Saved' : 'Unsaved'} />
        <Appbar.Action icon="content-save" onPress={handleSave} />
      </Appbar>

      {/* Options Menu */}
      <Menu
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item 
          onPress={() => {
            setIsMenuVisible(false);
            setIsCategoryDialogVisible(true);
          }} 
          title="Change Category"
          leadingIcon="tag-outline"
        />
        {!isNew && (
          <>
            <Menu.Item 
              onPress={() => {
                setIsMenuVisible(false);
                handleExport();
              }} 
              title="Export Note"
              leadingIcon="export-variant"
            />
            <Divider />
            <Menu.Item 
              onPress={() => {
                setIsMenuVisible(false);
                handleDelete();
              }} 
              title="Delete Note"
              leadingIcon="delete-outline"
              titleStyle={{ color: colors.error }}
            />
          </>
        )}
      </Menu>

      {/* Category Selection Dialog */}
      <Portal>
        <CategorySelector
          visible={isCategoryDialogVisible}
          onDismiss={() => setIsCategoryDialogVisible(false)}
          categories={categories}
          selectedCategory={category}
          onSelect={(selected) => {
            setCategory(selected);
            setIsCategoryDialogVisible(false);
          }}
        />
      </Portal>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={isDeleteDialogVisible} onDismiss={() => setIsDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Note</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value="Are you sure you want to delete this note? This action cannot be undone."
              multiline
              editable={false}
              style={styles.dialogText}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Discard Changes Dialog */}
      <Portal>
        <Dialog visible={isDiscardDialogVisible} onDismiss={() => setIsDiscardDialogVisible(false)}>
          <Dialog.Title>Discard Changes</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value="You have unsaved changes. Do you want to discard them?"
              multiline
              editable={false}
              style={styles.dialogText}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDiscardDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDiscard} textColor={colors.error}>Discard</Button>
            <Button onPress={handleSave} textColor={colors.primary}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoryPlaceholder: {
    color: colors.textSecondary,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    minHeight: 300,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    marginTop: 50,
    backgroundColor: colors.surface,
  },
  dialogText: {
    backgroundColor: 'transparent',
    color: colors.textPrimary,
  },
});

export default NoteScreen;
