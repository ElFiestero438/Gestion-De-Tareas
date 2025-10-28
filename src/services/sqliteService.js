import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("tasks.db");

export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        imageUrl TEXT,
        createdAt TEXT
      );`,
      [],
      () => console.log("Tabla 'tasks' lista ✅"),
      (_, error) => console.error("Error creando tabla:", error)
    );
  });
};

// 🔹 Agregar tarea localmente
export const addLocalTask = (title, description, imageUrl = null) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO tasks (title, description, imageUrl, createdAt) VALUES (?, ?, ?, datetime('now'))`,
        [title, description, imageUrl],
        (_, result) => {
          console.log("Tarea local agregada con ID:", result.insertId);
          resolve(result.insertId);
        },
        (_, error) => {
          console.error("Error agregando tarea local:", error);
          reject(error);
        }
      );
    });
  });
};

// 🔹 Obtener todas las tareas locales
export const getLocalTasks = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM tasks ORDER BY createdAt DESC`,
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          console.error("Error al obtener tareas locales:", error);
          reject(error);
        }
      );
    });
  });
};

// 🔹 Actualizar una tarea
export const updateLocalTask = (id, title, description, completed) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`,
        [title, description, completed ? 1 : 0, id],
        () => {
          console.log("Tarea local actualizada:", id);
          resolve(true);
        },
        (_, error) => {
          console.error("Error actualizando tarea local:", error);
          reject(error);
        }
      );
    });
  });
};

// 🔹 Eliminar una tarea
export const deleteLocalTask = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM tasks WHERE id = ?`,
        [id],
        () => {
          console.log("Tarea local eliminada:", id);
          resolve(true);
        },
        (_, error) => {
          console.error("Error eliminando tarea local:", error);
          reject(error);
        }
      );
    });
  });
};
