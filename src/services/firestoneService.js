import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

/**

 * @param {string} userId 
 * @param {object} taskData 
 */
export const addTask = async (userId, taskData) => {
  try {
    const tasksRef = collection(db, "users", userId, "tasks");
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: new Date(),
    });
    console.log("Tarea agregada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar tarea:", error);
  }
};


export const getTasks = async (userId) => {
  try {
    const tasksRef = collection(db, "users", userId, "tasks");
    const snapshot = await getDocs(tasksRef);
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return tasks;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return [];
  }
};


export const getTaskById = async (userId, taskId) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    const docSnap = await getDoc(taskRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("No se encontró la tarea con ID:", taskId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener tarea:", error);
  }
};


export const updateTask = async (userId, taskId, newData) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, newData);
    console.log("Tarea actualizada:", taskId);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
  }
};


export const deleteTask = async (userId, taskId) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
    console.log("Tarea eliminada:", taskId);
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};
