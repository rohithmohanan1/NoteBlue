import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, TouchableRipple } from 'react-native-paper';
import colors from '../constants/colors';

const NoteCard = ({ note, onPress, onDelete }) => {
  const { title, content, category, updatedAt } = note;
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get preview of content (first few characters)
  const getContentPreview = (text) => {
    // Remove any HTML tags if the content has formatting
    const plainText = text.replace(/<[^>]*>?/gm, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  return (
    <Card style={styles.card}>
      <TouchableRipple onPress={onPress} style={styles.touchable}>
        <View>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title || 'Untitled Note'}
            </Text>
            <IconButton
              icon="delete-outline"
              size={20}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={styles.deleteButton}
              iconColor={colors.error}
            />
          </View>
          
          <Card.Content style={styles.content}>
            <Text style={styles.preview} numberOfLines={3}>
              {getContentPreview(content)}
            </Text>
          </Card.Content>
          
          <View style={styles.footer}>
            {category ? (
              <View style={styles.categoryContainer}>
                <IconButton
                  icon="tag"
                  size={14}
                  style={styles.tagIcon}
                  iconColor={colors.primary}
                />
                <Text style={styles.category}>{category}</Text>
              </View>
            ) : null}
            <Text style={styles.date}>{formatDate(updatedAt)}</Text>
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 2,
  },
  touchable: {
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 4,
    paddingTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon: {
    margin: 0,
    padding: 0,
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    marginLeft: -4,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  deleteButton: {
    margin: 0,
  },
});

export default NoteCard;
