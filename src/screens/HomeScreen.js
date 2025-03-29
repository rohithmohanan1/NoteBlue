import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { 
  FAB, 
  Appbar, 
  Menu, 
  Divider, 
  Text,
  Dialog,
  Button,
  Portal,
  Chip
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  const { notes, categories, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'alphabetical'

  // Filter notes based on search query and selected category
  useEffect(() => {
    let result = [...notes];
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        note => 
          note.title.toLowerCase().includes(lowerCaseQuery) || 
          note.content.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by selected category
    if (selectedCategory) {
      result = result.filter(note => note.category === selectedCategory);
    }
    
    // Apply sorting
    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sortOrder === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredNotes(result);
  }, [notes, searchQuery, selectedCategory, sortOrder]);

  useFocusEffect(
    useCallback(() => {
      // Refresh the list when the screen comes into focus
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredNotes(
        notes
          .filter(note => 
            (selectedCategory ? note.category === selectedCategory : true) &&
            (searchQuery ? 
              note.title.toLowerCase().includes(lowerCaseQuery) || 
              note.content.toLowerCase().includes(lowerCaseQuery) : true)
          )
          .sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt);
            if (sortOrder === 'oldest') return new Date(a.updatedAt) - new Date(b.updatedAt);
            if (sortOrder === 'alphabetical') return a.title.localeCompare(b.title);
            return 0;
          })
      );
    }, [notes, searchQuery, selectedCategory, sortOrder])
  );

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    closeMenu();
  };
  
  const handleDeletePress = (noteId) => {
    setNoteToDelete(noteId);
    setDeleteDialogVisible(true);
  };
  
  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setDeleteDialogVisible(false);
      setNoteToDelete(null);
    }
  };
  
  const dismissDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setNoteToDelete(null);
  };

  const renderItem = ({ item }) => (
    <NoteCard
      note={item}
      onPress={() => navigation.navigate('Note', { noteId: item.id })}
      onDelete={() => handleDeletePress(item.id)}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="note-text-outline"
      title="No Notes Yet"
      description={searchQuery || selectedCategory ? 
        "No notes match your filters" : 
        "Tap the + button to create your first note"
      }
    />
  );

  const renderCategoryChips = () => (
    <View style={styles.chipContainer}>
      {selectedCategory && (
        <Chip 
          mode="outlined" 
          onClose={() => setSelectedCategory(null)}
          style={styles.chip}
          textStyle={styles.chipText}
        >
          {selectedCategory}
        </Chip>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="My Notes" />
        <Appbar.Action icon="sort" onPress={openMenu} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<View />}
          style={styles.menu}
        >
          <Menu.Item 
            onPress={() => { setSortOrder('newest'); closeMenu(); }} 
            title="Newest first"
            leadingIcon="clock-outline"
          />
          <Menu.Item 
            onPress={() => { setSortOrder('oldest'); closeMenu(); }} 
            title="Oldest first"
            leadingIcon="clock-outline"
          />
          <Menu.Item 
            onPress={() => { setSortOrder('alphabetical'); closeMenu(); }} 
            title="Alphabetical"
            leadingIcon="sort-alphabetical-ascending"
          />
          <Divider />
          <Menu.Item 
            onPress={() => navigation.navigate('Categories')} 
            title="Manage Categories"
            leadingIcon="tag-outline"
          />
          <Divider />
          <Text style={styles.menuHeader}>Filter by category:</Text>
          {categories.map(category => (
            <Menu.Item
              key={category}
              onPress={() => handleCategorySelect(category)}
              title={category}
              leadingIcon={selectedCategory === category ? "check" : "tag"}
            />
          ))}
          {categories.length > 0 && <Divider />}
          <Menu.Item
            onPress={() => { setSelectedCategory(null); closeMenu(); }}
            title="Show all"
            leadingIcon="view-list"
          />
        </Menu>
      </Appbar.Header>
      
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      {renderCategoryChips()}
      
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={renderEmptyState}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        color={colors.white}
        onPress={() => navigation.navigate('Note', { isNew: true })}
      />

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={dismissDeleteDialog}>
          <Dialog.Title>Delete note?</Dialog.Title>
          <Dialog.Content>
            <Text>This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={dismissDeleteDialog}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={colors.error}>Delete</Button>
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
  notesList: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  menu: {
    marginTop: 50,
    marginRight: 10,
    backgroundColor: colors.surface,
  },
  menuHeader: {
    padding: 8,
    paddingHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    backgroundColor: colors.primaryDark,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: colors.white,
  },
});

export default HomeScreen;
