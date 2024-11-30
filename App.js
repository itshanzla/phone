
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [SearchOpen, setSearchOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    saveContacts();
  }, [contacts]);

  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('contacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.error('Error loading contacts from AsyncStorage:', error);
    }
  };

  const saveContacts = async () => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts to AsyncStorage:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
        <View style={{ width: '83%' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'black' }}>Contacts</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
          {SearchOpen ? (
            <>
              <TextInput
                style={{ width: 100, borderWidth: 1, backgroundColor: 'white', padding: 10, marginTop: 3, marginBottom: 3, }}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              <TouchableOpacity onPress={() => setSearchOpen(false)}>
                <Icon name='close' size={30} padding={9} color="black" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setSearchOpen(true)} style={{ marginRight: 5 }}>
              <Icon name='search' size={30} padding={9} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={SearchOpen ? contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase())) : contacts}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10, marginTop: 10, borderWidth: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, padding: 5 }}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: 'black' }}>Number: {item.number}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              if (searchQuery) {
                return;
              }
              Alert.alert(
                'Delete Contact',
                'Are you sure you want to delete this contact?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete', style: 'destructive', onPress: () => {
                      const updatedContacts = [...contacts];
                      updatedContacts.splice(index, 1);
                      setContacts(updatedContacts);
                    }
                  },
                ],
                { cancelable: false }
              );
            }} style={{ padding: 10 }}>
              <Icon name='trash' size={25} color="black" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(index) => index.toString()}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, backgroundColor: 'white', padding: 10, marginBottom: 10 }} />
          <TextInput placeholder="Number" value={number} onChangeText={setNumber} style={{ borderWidth: 1, backgroundColor: 'white', padding: 10, marginBottom: 10 }} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, backgroundColor: 'white', padding: 10, marginBottom: 10 }} />
          <TouchableOpacity onPress={() => {
            if (!name || !number || !email) {
              return;
            }
            const newContact = {
              name,
              number,
              email,
            };
            setContacts([...contacts, newContact]);
            setName('');
            setNumber('');
            setEmail('');
            setModalVisible(false);
          }} style={{ backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 5 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Save Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue', fontSize: 16, textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'blue',
          padding: 15,
          alignItems: 'center',
          borderRadius: 150,
        }}
      >
        <Icon name='add' size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ContactList;
