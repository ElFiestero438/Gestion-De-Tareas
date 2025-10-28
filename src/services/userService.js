import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../src/services/firebaseConfig';

useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Guardar/actualizar perfil en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: new Date()
      }, { merge: true });
    }
    setUser(user);
  });
  return unsub;
}, []);
