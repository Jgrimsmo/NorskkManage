import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface Item {
  id: string;
  name: string;
  description: string;
}

export default function DataScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const loadedItems: Item[] = [];
      querySnapshot.forEach((doc) => {
        loadedItems.push({ id: doc.id, ...doc.data() } as Item);
      });
      setItems(loadedItems);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const addItem = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'items'), {
        name: name.trim(),
        description: description.trim(),
        createdAt: new Date(),
      });
      setName('');
      setDescription('');
      await loadItems();
      Alert.alert('Success', 'Item added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'items', itemId));
              await loadItems();
              Alert.alert('Success', 'Item deleted successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.itemDescription}>{item.description}</Text>
        ) : null}
      </View>
      <Button
        title="Delete"
        variant="outline"
        onPress={() => deleteItem(item.id)}
        style={styles.deleteButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Management</Text>
      
      <View style={styles.form}>
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter item name"
        />
        
        <Input
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />
        
        <Button
          title={loading ? 'Adding...' : 'Add Item'}
          onPress={addItem}
          disabled={loading}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Items ({items.length})</Text>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 30,
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteButton: {
    minWidth: 80,
  },
});
