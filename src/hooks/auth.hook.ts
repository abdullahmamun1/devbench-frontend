import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, userLogin, userLogout } from "@/api";
import { ROLE_HOME } from "@/constants/roles";

export function useGetMe() {
  return useQuery({ queryKey: ["user"], queryFn: getMe, retry: false });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: (res) => {
      queryClient.clear();
      router.replace(ROLE_HOME[res.data.user.role]);
      router.refresh(); // makes the proxy re-run with the new cookie
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
