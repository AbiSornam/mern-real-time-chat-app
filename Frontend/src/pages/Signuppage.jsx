import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Signuppage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Signup success!", data);

  // ✅ Store the user in cache so app updates instantly
  const returnedUser = data?.user || data?.User || null;
  queryClient.setQueryData(["authUser"], returnedUser);

      // Navigate based on whether the user still needs onboarding.
      // If backend already marks user as onboarded, go to home; otherwise go to onboarding.
      const onboarded = data?.user?.isOnboarded;
      navigate(onboarded ? "/" : "/onboarding");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Signup failed");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();

    if (signupData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    setValidationError("");
    mutate(signupData); // ✅ send latest form data
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010] p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-[#191919] rounded-xl shadow-2xl overflow-hidden border border-neutral-800">
        {/* LEFT COL: FORM */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-5 flex items-center gap-2">
            <ShipWheelIcon className="size-8 text-green-400" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200 tracking-wider">
              Streamify
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message}</span>
            </div>
          )}

          <form onSubmit={handleSignup}>
            <h2 className="text-xl font-semibold text-white mb-1">
              Create an Account
            </h2>
            <p className="text-sm text-gray-400 mb-7">
              Join Streamify and start your language learning adventure!
            </p>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#151515] text-white text-base rounded-md p-3 mb-4 border-none focus:ring-2 focus:ring-green-400 outline-none placeholder-gray-400"
              value={signupData.fullName}
              onChange={(e) =>
                setSignupData({ ...signupData, fullName: e.target.value })
              }
              required
              autoComplete="off"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full bg-[#151515] text-white text-base rounded-md p-3 mb-4 border-none focus:ring-2 focus:ring-green-400 outline-none placeholder-gray-400"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              required
              autoComplete="off"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#151515] text-white text-base rounded-md p-3 mb-1 border-none focus:ring-2 focus:ring-green-400 outline-none placeholder-gray-400"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              required
              autoComplete="off"
            />

            {validationError ? (
              <p className="text-xs text-red-500 mt-1">{validationError}</p>
            ) : (
              <p className="text-xs opacity-70 mt-1">
                Password must be at least 6 characters long
              </p>
            )}

            <div className="flex items-center mb-5">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 accent-green-500"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-400">
                I agree to the&nbsp;
                <span className="text-green-400 underline cursor-pointer">
                  terms of service
                </span>
                &nbsp;and&nbsp;
                <span className="text-green-400 underline cursor-pointer">
                  privacy policy
                </span>
              </label>
            </div>

            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white text-base py-2.5 rounded-md font-semibold mb-3 transition-colors"
              type="submit"
            >
              {isLoading ? "Signing up..." : "Create Account"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-400 underline hover:text-green-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT COL: IMAGE & CAPTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#212722] items-center justify-center">
          <div className="max-w-md p-8">
            <div className="w-[280px] mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="text-center mt-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Connect with language partners worldwide
              </h2>
              <p className="text-sm opacity-70 text-gray-200">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signuppage;
