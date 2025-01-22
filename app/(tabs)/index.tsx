import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';


interface Usuario {
  id:number,
  nombre: string,
  email: string
}

const App = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const apiUrl = 'http://localhost:3000/usuarios';

  const obtenerUsuarios = async () => {
    try{
      const response = await axios.get<Usuario[]>(apiUrl);
      setUsuarios(response.data);
    } catch(error) { 
      console.log('Error al obtener los usuarios: ',error);
    }
  };

  const crearUsuario = async() =>{
    if(nombre && email) {
      try {
        await axios.post(`${apiUrl}/add`, { nombre, email });
        obtenerUsuarios();
        setNombre('');
        setEmail('');
      }catch(error){
        console.error('Error al crear usuario: ',error);
      }
    }else{
      Alert.alert('Error','Por favor, completa todos los campos');
    }
  };

  const actualizarUsuario = async() =>{
    if(nombre && email && selectedUserId !== null) {
      try {
        await axios.put(`${apiUrl}/update/${selectedUserId}`, { nombre, email });
        obtenerUsuarios();
        setNombre('');
        setEmail('');
        setSelectedUserId(null);
      }catch(error) {
        console.error('Error al actualizar el usuario', error);
      }
    }else{
      Alert.alert('Error', 'Por favor, selecciona un usuario para actualizar');
    }
  };

  const borrarUsuario = async(id: number) => {
    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      obtenerUsuarios();
    }catch(error){
      console.error('Error al eliminar el usuario', error);
    }
  };
  useEffect(() =>{
    obtenerUsuarios()
  },[]);
  return(
    <View style = {{padding:20}}>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style = {{borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style = {{borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title = { selectedUserId ? 'Actualizar Usuario' : 'Crear Usuario' } onPress={ selectedUserId ? actualizarUsuario : crearUsuario }/>

      <FlatList
        data={usuarios}
        keyExtractor={ (item) => item.id.toString() }
        renderItem={ ({item})=>(
          <View style = {{marginVertical: 10, padding:10, borderWidth:1 }}>
            <Text>{item.nombre}</Text>
            <Text>{item.email}</Text>
            <TouchableOpacity onPress={ () => {setSelectedUserId(item.id); setNombre(item.nombre); setEmail(item.email);}}>
              <Text style={{color:'blue'}}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {borrarUsuario(item.id)}}>
              <Text style={{color:'red'}}>Eliminar</Text>
            </TouchableOpacity>
          </View>

        )}
        />
     </View>   
  );
};

export default App;