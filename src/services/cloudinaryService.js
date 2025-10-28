/**
 * 
 * @param {string} imageUri 
 * @returns {Promise<string|null>} 
 */

export const uploadImage = async (imageUri) => {
  try {
    const CLOUD_NAME = "do3givwfl"; 
    const UPLOAD_PRESET = "Gestion_Tareas"; 

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "task_image.jpg",
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
      console.error("Error en la subida:", data);
      return null;
    }

    console.log("Imagen subida correctamente:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    return null;
  }
};


