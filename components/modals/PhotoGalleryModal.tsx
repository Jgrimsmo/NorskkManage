import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../../services/photoService';

interface PhotoGalleryModalProps {
  visible: boolean;
  onClose: () => void;
  photos: Photo[];
  initialIndex?: number;
  onDeletePhoto?: (photoId: string) => void;
  canDelete?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PhotoGalleryModal({
  visible,
  onClose,
  photos,
  initialIndex = 0,
  onDeletePhoto,
  canDelete = false,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoading, setImageLoading] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleDelete = () => {
    if (!onDeletePhoto || !canDelete) return;

    const currentPhoto = photos[currentIndex];
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeletePhoto(currentPhoto.id);
            // Adjust index if we deleted the last photo
            if (currentIndex >= photos.length - 1) {
              setCurrentIndex(Math.max(0, photos.length - 2));
            }
          },
        },
      ]
    );
  };

  const formatPhotoInfo = (photo: Photo): string => {
    const date = new Date(photo.timestamp).toLocaleDateString();
    const time = new Date(photo.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${date} at ${time}`;
  };

  if (!visible || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {currentIndex + 1} of {photos.length}
            </Text>
            {currentPhoto.name && (
              <Text style={styles.headerSubtitle}>{currentPhoto.name}</Text>
            )}
          </View>
          
          {canDelete && onDeletePhoto && (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentPhoto.uri }}
            style={styles.mainImage}
            resizeMode="contain"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Photo Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {formatPhotoInfo(currentPhoto)}
          </Text>
          <Text style={styles.infoSubtext}>
            Source: {currentPhoto.type === 'camera' ? 'Camera' : 'Gallery'}
          </Text>
        </View>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            {photos.map((photo, index) => (
              <TouchableOpacity
                key={photo.id}
                onPress={() => setCurrentIndex(index)}
                style={[
                  styles.thumbnail,
                  index === currentIndex && styles.thumbnailActive,
                ]}
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 2,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  navButtonLeft: {
    left: 16,
  },
  navButtonRight: {
    right: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoSubtext: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 4,
  },
  thumbnailContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
