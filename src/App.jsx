import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Google OAuth
  const signUpWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  // Email OTP
  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error("Error sending OTP", error.message);
    } else {
      setOtpSent(true);
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign-out error", error.message);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Welcome
          </h1>

          <button
            onClick={signUpWithGoogle}
            className="btn btn-primary w-full mb-4"
          >
            Sign in with Google
          </button>

          <div className="divider">OR</div>

          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full mb-2"
          />

          <button
            onClick={signInWithEmail}
            className="btn btn-secondary w-full"
          >
            Send Magic Link
          </button>

          {otpSent && (
            <p className="text-sm text-green-600 mt-3 text-center">
               Check your email for the login link
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6 text-center">
        <img
          src={session?.user?.user_metadata?.avatar_url}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-3"
        />

        <h2 className="text-xl font-semibold">
          {session?.user?.user_metadata?.full_name}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {session?.user?.email}
        </p>

        <button
          onClick={signOut}
          className="btn btn-error w-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default App;
