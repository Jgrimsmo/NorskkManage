import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Alert } from 'react-native';

export interface Photo {
  id: string;
  uri: string;
  name?: string;
  timestamp: string;
  type: 'camera' | 'gallery';
  size?: number;
  uploaded?: boolean;
}

export class PhotoService {
  private static instance: PhotoService;
  private storage = getStorage();

  public static getInstance(): PhotoService {
    if (!PhotoService.instance) {
      PhotoService.instance = new PhotoService();
    }
    return PhotoService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async takePhoto(): Promise<Photo | null> {
    try {
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Required', 'Camera permissions are required to take photos.');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          uri: asset.uri,
          name: `Photo_${new Date().toISOString().split('T')[0]}.jpg`,
          timestamp: new Date().toISOString(),
          type: 'camera',
          size: asset.fileSize,
        };
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  async selectFromGallery(): Promise<Photo | null> {
    try {
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Required', 'Gallery permissions are required to select photos.');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          uri: asset.uri,
          name: asset.fileName || `Gallery_${new Date().toISOString().split('T')[0]}.jpg`,
          timestamp: new Date().toISOString(),
          type: 'gallery',
          size: asset.fileSize,
        };
      }
      return null;
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
      return null;
    }
  }

  async uploadPhoto(photo: Photo, reportId: string, onProgress?: (progress: number) => void): Promise<string | null> {
    try {
      // Create a reference to the photo in Firebase Storage
      const photoRef = ref(this.storage, `daily-reports/${reportId}/${photo.id}.jpg`);
      
      // Convert the image to blob
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      
      // Upload the image with progress tracking
      const uploadTask = uploadBytes(photoRef, blob);
      
      // Simulate progress if callback provided
      if (onProgress) {
        onProgress(0);
        setTimeout(() => onProgress(50), 100);
        setTimeout(() => onProgress(100), 500);
      }
      
      await uploadTask;
      
      // Get the download URL
      const downloadURL = await getDownloadURL(photoRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
      return null;
    }
  }

  async deletePhoto(photoId: string, reportId: string): Promise<boolean> {
    try {
      const photoRef = ref(this.storage, `daily-reports/${reportId}/${photoId}.jpg`);
      await deleteObject(photoRef);
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      // Don't show alert for delete errors as the photo might not exist
      return false;
    }
  }

  async addPhotoToReport(reportId: string, photo: Photo): Promise<boolean> {
    try {
      // Upload photo to storage
      const downloadURL = await this.uploadPhoto(photo, reportId);
      if (!downloadURL) return false;

      // Add photo reference to report document
      const reportRef = doc(db, 'dailyReports', reportId);
      await updateDoc(reportRef, {
        photos: arrayUnion({
          id: photo.id,
          uri: downloadURL,
          name: photo.name,
          timestamp: photo.timestamp,
          type: photo.type,
          size: photo.size,
        }),
      });

      return true;
    } catch (error) {
      console.error('Error adding photo to report:', error);
      Alert.alert('Error', 'Failed to add photo to report. Please try again.');
      return false;
    }
  }

  async removePhotoFromReport(reportId: string, photoId: string): Promise<boolean> {
    try {
      // Get current report to find the photo
      const reportRef = doc(db, 'dailyReports', reportId);
      
      // Delete from storage
      await this.deletePhoto(photoId, reportId);
      
      // Remove photo reference from report document
      // Note: We need to remove the entire photo object, not just the ID
      // This requires getting the current photos array and filtering it
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        const currentPhotos = reportDoc.data().photos || [];
        const updatedPhotos = currentPhotos.filter((photo: Photo) => photo.id !== photoId);
        
        await updateDoc(reportRef, {
          photos: updatedPhotos,
        });
      }

      return true;
    } catch (error) {
      console.error('Error removing photo from report:', error);
      Alert.alert('Error', 'Failed to remove photo. Please try again.');
      return false;
    }
  }

  async takePhotoAndUpload(reportId: string, onProgress?: (progress: number) => void): Promise<Photo | null> {
    try {
      const photo = await this.takePhoto();
      if (!photo) return null;

      // Upload photo and get download URL
      const downloadURL = await this.uploadPhoto(photo, reportId, onProgress);
      if (!downloadURL) return null;

      // Return photo with uploaded URI
      return {
        ...photo,
        uri: downloadURL, // Use the Firebase Storage URL
        uploaded: true
      };
    } catch (error) {
      console.error('Error taking and uploading photo:', error);
      Alert.alert('Error', 'Failed to take and upload photo. Please try again.');
      return null;
    }
  }

  async selectFromGalleryAndUpload(reportId: string, onProgress?: (progress: number) => void): Promise<Photo | null> {
    try {
      const photo = await this.selectFromGallery();
      if (!photo) return null;

      // Upload photo and get download URL
      const downloadURL = await this.uploadPhoto(photo, reportId, onProgress);
      if (!downloadURL) return null;

      // Return photo with uploaded URI
      return {
        ...photo,
        uri: downloadURL, // Use the Firebase Storage URL
        uploaded: true
      };
    } catch (error) {
      console.error('Error selecting and uploading photo:', error);
      Alert.alert('Error', 'Failed to select and upload photo. Please try again.');
      return null;
    }
  }

  showPhotoOptions(onTakePhoto: () => void, onSelectPhoto: () => void): void {
    Alert.alert(
      'Add Photo',
      'Choose how you would like to add a photo:',
      [
        {
          text: 'Camera',
          onPress: onTakePhoto,
        },
        {
          text: 'Gallery',
          onPress: onSelectPhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  getPhotoDisplayName(photo: Photo): string {
    return photo.name || `Photo_${new Date(photo.timestamp).toLocaleDateString()}`;
  }
}
