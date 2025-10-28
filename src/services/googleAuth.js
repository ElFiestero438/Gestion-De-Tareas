import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Constants from 'expo-constants';
import { auth } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const extra = (Constants.expoConfig && Constants.expoConfig.extra) || process.env;
  const clientId = extra.EXPO_GOOGLE_EXPO_CLIENT_ID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: clientId,
    androidClientId: clientId,
    iosClientId: clientId,
    webClientId: clientId,
  });

  const signInWithGoogle = async () => {
    const result = await promptAsync();
    if (result?.type === 'success') {
      const id_token = result.params.id_token || result.params.id_token; // depending on platform
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    } else {
      throw new Error('Google sign-in cancelled');
    }
  };

  return { signInWithGoogle, request, response };
};
