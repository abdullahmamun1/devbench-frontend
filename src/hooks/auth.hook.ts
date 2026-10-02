import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchError } from "ofetch";
import { toast } from "sonner";
import { getMe, userLogin, userLogout } from "@/api";
import { ROLE_HOME } from "@/constants/roles";
import type { LoginPayload } from "@/types";
import { getErrorMessage } from "@/utils/error";

export function useGetMe() {
  return useQuery({ queryKey: ["user"], queryFn: getMe, retry: false });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await userLogin(payload);
      return getMe();
    },
    onSuccess: (res) => {
      const home = ROLE_HOME[res.data.role];
      const redirect = searchParams.get("redirect");
      queryClient.clear();
      queryClient.setQueryData(["user"], res);
      router.replace(redirect?.startsWith(home) ? redirect : home);
      router.refresh();
    },
    onError: (error, variables) => {
      const message = getErrorMessage(error);
      toast.error(message);
      // backend answers 403 "Please verify your email..." for unverified users
      if (
        error instanceof FetchError &&
        error.statusCode === 403 &&
        message.toLowerCase().includes("verify")
      ) {
        router.push(
          `/verify-email?email=${encodeURIComponent(variables.email)}`,
        );
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogout,
    onSettled: () => {
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}
