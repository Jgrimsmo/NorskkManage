import { StyleSheet, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NorskkManage</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View style={styles.userInfo}>
        <Text style={styles.userText}>Logged in as:</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userText: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
