import { auth, ggProvider } from "@/config/firebase";
import {
  OAuthProvider,
  linkWithPopup,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const SignInButton = () => {
  const [user, loading] = useAuthState(auth);

  const loginWithGG = () => {
    signInWithPopup(auth, ggProvider)
      .then(() => console.log("signInWithPopup Success"))
      .catch((err) => console.log(err.message));
  };

  const linkAccWithGG = () => {
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      linkWithPopup(auth.currentUser, ggProvider)
        .then(() => {
          // Accounts successfully linked.
          // const user = result.user;
          console.log("Accounts successfully linked ");
        })
        .catch((error) => {
          // Handle Errors here.
          // Accounts already linked
          if (
            error.message ===
            "Firebase: Error (auth/credential-already-in-use)."
          ) {
            const credential = OAuthProvider.credentialFromError(error);
            if (credential) {
              signInWithCredential(auth, credential)
                .then(() => console.log("signInWithCredential successfully"))
                .catch((err) =>
                  console.log("signInWithCredential unsuccessful ", err.message)
                );
            } else {
              alert(error.message);
            }
          } else if (
            error.message !== "Firebase: Error (auth/cancelled-popup-request)."
          ) {
            alert(error.message);
          }
        });
    } else {
      loginWithGG();
    }
  };

  if (!user || loading)
    return (
      <div className="text-sm flex justify-center mb-2  text-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="text-sm flex justify-between mb-2  text-gray-200">
      <p>Hello, {user.displayName || user.email || "Anonymous"}</p>
      <div className="flex gap-5">
        <button type="button" className="menuButton" onClick={linkAccWithGG}>
          {user.isAnonymous ? "Sign in" : "Not you?"}
        </button>
        {user.isAnonymous === false && (
          <button
            type="button"
            className="menuButton"
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};
export default SignInButton;
