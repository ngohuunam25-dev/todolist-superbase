import { useAppDispatch } from "@/app/hooks";
import { loginUser } from "@/features/auth/userSlice";
import React, { FC } from "react";

const Auth: FC = () => {
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSignUp = () => {
    //   ts ignore
  };
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");
    // setLoading(true);

    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   });
    //   if (error) throw error;
    //   console.log("data line25", data);
    // } catch (error: unknown) {
    //   //@typescript-eslint/no-explicit-any
    //   setError((error as any).message || "Đăng nhập thất bại");
    // } finally {
    //   setLoading(false);
    // }
    dispatch(loginUser({ email, password }));
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-600">
          {isSignUp ? "📝 Đăng ký" : "🔐 Đăng nhập"}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : isSignUp ? "Đăng ký" : "Đăng nhập"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-sm text-indigo-600 hover:underline"
          >
            {isSignUp
              ? "Đã có tài khoản? Đăng nhập"
              : "Chưa có tài khoản? Đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
