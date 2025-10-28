
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../navigation/AuthContext';
import sqliteService from '../services/sqliteService';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import colors from '../constants/colors';




const emptyForm = {
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: '',
    estado:'',
}


const TaskForm = ({onClose}) => {
    const {user} = useAuth();
    const [form, setForm]= useState(emptyForm);
    const [loading, setloading]=useState(false);

    useEffect(()=>{
        let mounted = true;
        const load = async ()=>{
            if(!user) return;
            try {
                setloading(true);
                const data = sqliteService.getTaskById(user.uid);
                if (mounted) {
                   if (data) {
                    setForm({
                        titulo: data.titulo || '',
                        descripcion: data.descripcion || '',
                        fechaLimite: data.fechaLimite || '',
                        prioridad: data.prioridad || '',
                        estado: data.estado || '',
                    });
                   }else{
                    setForm(emptyForm);
                   } 
                }
            } catch (error) {
                console.warn('ERROR CARGANDO LOS DATOS ... DE SQLITE', error);
                Alert.alert('Error de carga', 'No fue posible cargar los datos de la base de datos local')    
            }finally{
                if (mounted) {
                    setloading(false);
                }
            }
        };
        load();
        return ()=>{
            mounted = false;
        };
    },[user]);

    const handleChange = (key, value) => 
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
    if (!user) return Alert.alert('Error', 'Usuario no autenticado');
    try {
      setLoading(true);
      // Llamada síncrona
      sqliteService.upsertTask(user.uid, form);
      Alert.alert('Guardado', 'Datos académicos guardados localmente');
      onClose(); // Cerrar el formulario después de guardar
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!user) return;
    Alert.alert(
      'Eliminar',
      '¿Esta seguro de que desea eliminar sus tareas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            (async () => {
              try {
                setLoading(true);
                sqliteService.deleteTaskById(user.uid);
                setForm(emptyForm);
                Alert.alert('Eliminada', 'La tarea ha sido eliminada');
                onClose(); 
              } catch (e) {
                console.error(e);
                Alert.alert('Error', 'No se pudo eliminar');
              } finally {
                setLoading(false);
              }
            })();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.principal} />
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Datos de su tarea </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Título</Text>
<TextInput style={styles.input} value={form.titulo} onChangeText={t => handleChange('titulo', t)} placeholder="Título de la tarea" />

<Text style={styles.label}>Descripción</Text>
<TextInput style={[styles.input, styles.multiline]} value={form.descripcion} onChangeText={t => handleChange('descripcion', t)} placeholder="Descripción de la tarea" multiline />

<Text style={styles.label}>Fecha Límite</Text>
<TextInput style={styles.input} value={form.fechaLimite} onChangeText={t => handleChange('fechaLimite', t)} placeholder="YYYY-MM-DD" />

<Text style={styles.label}>Prioridad</Text>
<TextInput style={styles.input} value={form.prioridad} onChangeText={t => handleChange('prioridad', t)} placeholder="Baja, Media o Alta" />

<Text style={styles.label}>Estado</Text>
<TextInput style={styles.input} value={form.estado} onChangeText={t => handleChange('estado', t)} placeholder="Pendiente o Completada" />

<Text style={styles.sectionTitle}>Gestión de Tareas</Text>


      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.delete]} onPress={handleDelete} disabled={loading}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loaderContainer: {
    padding: 12,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.principal,
  },
  closeButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#eee',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.subtle,
  },
  label: {
    fontSize: 13,
    color: colors.subtle,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  save: {
    backgroundColor: colors.principal,
  },
  delete: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
export default TaskForm

