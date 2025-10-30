import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  // Use mutateAsync so we can await the mutation and navigate immediately after success
  const { mutateAsync: onboardingMutationAsync, isLoading } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async () => {
      toast.success("Profile onboarded successfully");
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error during onboarding");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onboardingMutationAsync(formState);
      // navigate after successful mutation
      navigate("/");
    } catch (err) {
      // onError handled in mutation options, but catch to avoid unhandled rejection
      console.error("Onboarding error:", err);
    }
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-6'>
      {/* THIS IS THE LINE TO FIX - It sets the width and padding of the card */}
      <div className='bg-base-200 rounded-2xl shadow-xl w-full max-w-2xl min-w-[700px] p-10'>
        <h1 className='text-3xl font-bold text-center mb-8'>Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Avatar */}
          <div className='flex flex-col items-center space-y-4'>
            <div className='w-32 h-32 rounded-full bg-base-300 flex items-center justify-center overflow-hidden'>
              {formState.profilePic ? (
                <img src={formState.profilePic} alt='Profile Preview' className='w-full h-full object-cover' />
              ) : (
                <CameraIcon className='w-14 h-14 text-base-content opacity-40' />
              )}
            </div>
            <button
              type='button'
              onClick={handleRandomAvatar}
              className='btn btn-accent h-12 text-lg flex items-center justify-center gap-2'
            >
              <ShuffleIcon className='w-5 h-5' />
              Generate Random Avatar
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className='block mb-2 text-base font-medium'>Full Name</label>
            <input
              type='text'
              name='fullName'
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              className='input input-bordered w-full h-14 text-lg'
              placeholder='Your full name'
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className='block mb-2 text-base font-medium'>Bio</label>
            <textarea
              name='bio'
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className='textarea textarea-bordered w-full h-24 text-lg'
              placeholder='Tell others about yourself and your language learning goals'
              required
            />
          </div>

          {/* Languages */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <label className='block mb-2 text-base font-medium'>Native Language</label>
              <select
                name='nativeLanguage'
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className='select select-bordered w-full h-14 text-lg'
                required
              >
                <option value=''>Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block mb-2 text-base font-medium'>Learning Language</label>
              <select
                name='learningLanguage'
                value={formState.learningLanguage}
                onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                className='select select-bordered w-full h-14 text-lg'
                required
              >
                <option value=''>Select language you're learning</option>
                {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className='block mb-2 text-base font-medium'>Location</label>
            <div className='relative'>
              <MapPinIcon className='absolute top-1/2 -translate-y-1/2 left-3 w-6 h-6 text-base-content opacity-70' />
              <input
                type='text'
                name='location'
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className='input input-bordered w-full h-14 text-lg pl-12'
                placeholder='City, Country'
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className='btn btn-primary w-full h-14 text-lg flex items-center justify-center gap-2'
            disabled={isLoading}
            type='submit'
          >
            {!isLoading ? (
              <>
                <ShipWheelIcon className='w-6 h-6' />
                Complete Onboarding
              </>
            ) : (
              <>
                <LoaderIcon className='animate-spin w-6 h-6' />
                Onboarding...
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;