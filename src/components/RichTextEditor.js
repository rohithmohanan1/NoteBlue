import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import colors from '../constants/colors';

// A simplified rich text editor component
// In a real app, you'd use a more robust library like react-native-pell-rich-editor
// or react-native-webview with a JavaScript WYSIWYG editor

const RichTextEditor = ({ value, onChange, style }) => {
  const inputRef = useRef(null);
  
  // Functions to add formatting
  const addBold = () => {
    const currentText = value || '';
    const selection = inputRef.current.getSelection();
    
    if (selection && selection.start !== selection.end) {
      const selectedText = currentText.substring(selection.start, selection.end);
      const newText = 
        currentText.substring(0, selection.start) + 
        `**${selectedText}**` + 
        currentText.substring(selection.end);
      onChange(newText);
    } else {
      onChange(currentText + '**bold text**');
    }
  };
  
  const addItalic = () => {
    const currentText = value || '';
    const selection = inputRef.current.getSelection();
    
    if (selection && selection.start !== selection.end) {
      const selectedText = currentText.substring(selection.start, selection.end);
      const newText = 
        currentText.substring(0, selection.start) + 
        `_${selectedText}_` + 
        currentText.substring(selection.end);
      onChange(newText);
    } else {
      onChange(currentText + '_italic text_');
    }
  };
  
  const addBulletList = () => {
    onChange(value + '\n• List item');
  };
  
  const addNumberList = () => {
    onChange(value + '\n1. List item');
  };
  
  const addCheckbox = () => {
    onChange(value + '\n□ Task');
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <IconButton
          icon="format-bold"
          size={20}
          onPress={addBold}
          iconColor={colors.textPrimary}
          style={styles.toolbarButton}
        />
        <IconButton
          icon="format-italic"
          size={20}
          onPress={addItalic}
          iconColor={colors.textPrimary}
          style={styles.toolbarButton}
        />
        <IconButton
          icon="format-list-bulleted"
          size={20}
          onPress={addBulletList}
          iconColor={colors.textPrimary}
          style={styles.toolbarButton}
        />
        <IconButton
          icon="format-list-numbered"
          size={20}
          onPress={addNumberList}
          iconColor={colors.textPrimary}
          style={styles.toolbarButton}
        />
        <IconButton
          icon="checkbox-marked-outline"
          size={20}
          onPress={addCheckbox}
          iconColor={colors.textPrimary}
          style={styles.toolbarButton}
        />
      </View>
      
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        multiline
        style={[styles.editor, style]}
        placeholder="Start typing..."
        placeholderTextColor={colors.textSecondary}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        mode="flat"
        selectionColor={colors.primary}
        theme={{ colors: { text: colors.textPrimary } }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  toolbarButton: {
    margin: 0,
  },
  editor: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 8,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
});

export default RichTextEditor;
