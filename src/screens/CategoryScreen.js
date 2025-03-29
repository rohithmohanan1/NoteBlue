import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { 
  Appbar, 
  List, 
  Divider, 
  Dialog, 
  Portal, 
  Button, 
  TextInput,
  IconButton,
  Text
} from 'react-native-paper';
import { useNotes } from '../context/NotesContext';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';

const CategoryScreen = ({ navigation }) => {
  const { categories, addCategory, deleteCategory, notes } = useNotes();
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const showAddDialog = () => setIsAddDialogVisible(true);
  const hideAddDialog = () => {
    setIsAddDialogVisible(false);
    setNewCategoryName('');
  };

  const showDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogVisible(true);
  };
  
  const hideDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setCategoryToDelete(null);
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    const added = addCategory(trimmedName);
    if (!added) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    hideAddDialog();
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      hideDeleteDialog();
    }
  };

  const getNotesCountForCategory = (category) => {
    return notes.filter(note => note.category === category).length;
  };

  const renderCategoryItem = ({ item }) => (
    <List.Item
      title={item}
      titleStyle={styles.categoryTitle}
      description={`${getNotesCountForCategory(item)} notes`}
      descriptionStyle={styles.categoryDescription}
      left={props => <List.Icon {...props} icon="tag" color={colors.primary} />}
      right={props => (
        <IconButton
          {...props}
          icon="delete-outline"
          iconColor={colors.error}
          onPress={() => showDeleteDialog(item)}
        />
      )}
      style={styles.categoryItem}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="tag-outline"
      title="No Categories Yet"
      description="Tap the + button to create your first category"
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Categories" />
        <Appbar.Action icon="plus" onPress={showAddDialog} />
      </Appbar.Header>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Add Category Dialog */}
      <Portal>
        <Dialog visible={isAddDialogVisible} onDismiss={hideAddDialog}>
          <Dialog.Title>Add New Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              mode="outlined"
              style={styles.input}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideAddDialog}>Cancel</Button>
            <Button onPress={handleAddCategory}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Category Dialog */}
      <Portal>
        <Dialog visible={isDeleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to delete "{categoryToDelete}"? This will remove the category from all notes.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button onPress={handleDeleteCategory} textColor={colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
  },
  list: {
    flexGrow: 1,
  },
  categoryItem: {
    backgroundColor: colors.surface,
  },
  categoryTitle: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  categoryDescription: {
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
  },
  dialogText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
});

export default CategoryScreen;
