import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const user = result.user;

      localStorage.setItem(
        "meetflow-user",
        user.displayName
      );

      localStorage.setItem(
        "meetflow-email",
        user.email
      );

      localStorage.setItem(
        "meetflow-photo",
        user.photoURL
      );

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-10 rounded-3xl text-center w-[500px]">

        <h1 className="text-5xl font-bold text-white mb-4">
          MeetFlow 🚀
        </h1>

        <p className="text-slate-400 mb-8">
          Sign in to continue
        </p>

        <button
          onClick={loginWithGoogle}
          className="bg-white text-black px-8 py-4 rounded-xl font-bold w-full"
        >
          Continue With Google
        </button>

      </div>
    </div>
  );
}

export default Login;