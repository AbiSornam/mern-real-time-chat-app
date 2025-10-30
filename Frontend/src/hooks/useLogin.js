import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  // expose mutateAsync and isLoading so callers can await and react (e.g. navigate)
  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { error, isLoading, loginMutation: mutateAsync };
};

export default useLogin;