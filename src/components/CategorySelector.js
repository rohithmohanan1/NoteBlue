import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Button, List, Divider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constants/colors';
import { useNotes } from '../context/NotesContext';

const CategorySelector = ({ visible, onDismiss, categories, selectedCategory, onSelect }) => {
  const { addCategory } = useNotes();
  const [isAddMode, setIsAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleSelect = (category) => {
    onSelect(category);
  };

  const handleClear = () => {
    onSelect('');
  };

  const toggleAddMode = () => {
    setIsAddMode(!isAddMode);
    setNewCategory('');
    setError('');
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      setError('Category name cannot be empty');
      return;
    }

    if (categories.includes(trimmedCategory)) {
      setError('Category already exists');
      return;
    }

    addCategory(trimmedCategory);
    onSelect(trimmedCategory);
    onDismiss();
  };

  const renderCategoryItem = ({ item }) => (
    <List.Item
      title={item}
      titleStyle={styles.categoryTitle}
      onPress={() => handleSelect(item)}
      left={props => <List.Icon {...props} icon="tag" color={colors.primary} />}
      right={props => 
        selectedCategory === item ? (
          <Icon {...props} name="check" size={24} color={colors.primary} />
        ) : null
      }
      style={styles.categoryItem}
    />
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>
          {isAddMode ? 'Add New Category' : 'Select Category'}
        </Dialog.Title>
        
        <Dialog.Content style={styles.content}>
          {isAddMode ? (
            <View>
              <TextInput
                label="Category Name"
                value={newCategory}
                onChangeText={(text) => {
                  setNewCategory(text);
                  setError('');
                }}
                mode="outlined"
                style={styles.input}
                error={!!error}
                autoFocus
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.clearCategoryItem} 
                onPress={handleClear}
              >
                <View style={styles.clearCategoryContent}>
                  <Icon name="tag-off-outline" size={24} color={colors.textSecondary} />
                  <TextInput
                    value="No Category"
                    editable={false}
                    style={styles.clearCategoryText}
                  />
                  {selectedCategory === '' && (
                    <Icon name="check" size={24} color={colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
              
              <Divider style={styles.divider} />
              
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item}
                ItemSeparatorComponent={() => <Divider />}
                style={styles.list}
              />
            </>
          )}
        </Dialog.Content>
        
        <Dialog.Actions>
          {isAddMode ? (
            <>
              <Button onPress={toggleAddMode}>Cancel</Button>
              <Button onPress={handleAddCategory}>Add</Button>
            </>
          ) : (
            <>
              <Button onPress={onDismiss}>Cancel</Button>
              <Button onPress={toggleAddMode}>New Category</Button>
            </>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.surface,
  },
  content: {
    minHeight: 200,
    paddingHorizontal: 0,
  },
  list: {
    maxHeight: 300,
  },
  categoryItem: {
    backgroundColor: colors.surface,
  },
  categoryTitle: {
    color: colors.textPrimary,
  },
  clearCategoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  clearCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearCategoryText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: colors.textSecondary,
    backgroundColor: 'transparent',
  },
  divider: {
    backgroundColor: colors.divider,
  },
  input: {
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default CategorySelector;
