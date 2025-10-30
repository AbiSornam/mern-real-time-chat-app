// src/hooks/useAuthUser.js
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";
//useQuery-fetches data,catches,reloads data etc
export default function useAuthUser() {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  // normalize backend shape: some endpoints return { user } or { User }
  const authUser = data?.user || data?.User || data;

  return { authUser, isLoading };
}
