import { auth, ggProvider } from "@/config/firebase";
import { linkWithPopup, signInWithPopup, signOut } from "firebase/auth";
import { useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const SignInButton = () => {
  const [user, loading] = useAuthState(auth);

  const loginWithGG = useCallback(() => {
    signInWithPopup(auth, ggProvider)
      .then(() => console.log("signInWithPopup Success"))
      .catch((err) => console.log(err.message));
  }, []);

  const linkAccWithGG = useCallback(() => {
    if (auth.currentUser) {
      linkWithPopup(auth.currentUser, ggProvider)
        .then(() => {
          // Accounts successfully linked.
          // const user = result.user;
          console.log("Accounts successfully linked ");
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          // Accounts already linked
          if (
            error.message ===
            "Firebase: Error (auth/credential-already-in-use)."
          ) {
            alert("Already signed up with this account. Please sign in.");
          } else if (
            error.message !== "Firebase: Error (auth/cancelled-popup-request)."
          ) {
            alert(error.message);
          }
        });
    }
  }, []);

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
        {!user.emailVerified ? (
          <>
            <button
              type="button"
              className="menuButton"
              onClick={linkAccWithGG}
            >
              Sign up
            </button>
            <button type="button" className="menuButton" onClick={loginWithGG}>
              Sign in
            </button>
          </>
        ) : (
          <>
            <button type="button" className="menuButton" onClick={loginWithGG}>
              Switch account
            </button>
            <button
              type="button"
              className="menuButton"
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default SignInButton;
