import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import colors from '../constants/colors';

const SearchBar = ({ value, onChangeText, onClear }) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search notes..."
        onChangeText={onChangeText}
        value={value}
        style={styles.searchbar}
        inputStyle={styles.input}
        iconColor={colors.textSecondary}
        clearIcon="close-circle"
        onClearIconPress={onClear}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: colors.surface,
    borderRadius: 8,
    height: 48,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
  },
});

export default SearchBar;
