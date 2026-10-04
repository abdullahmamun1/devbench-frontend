"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchError } from "ofetch";
import { toast } from "sonner";
import {
  forgotPassword,
  getMe,
  googleLogin,
  resetPassword,
  userLogin,
  userLogout,
  userRegister,
  verifyEmail,
} from "@/api";
import { ROLE_HOME } from "@/constants/roles";
import type {
  ApiResponse,
  GoogleLoginPayload,
  LoginPayload,
  User,
  VerifyEmailPayload,
} from "@/types";
import { getErrorMessage } from "@/utils/error";

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRole() {
  const { data } = useGetMe();
  return data?.data?.role;
}

// Shared by login and email verification: store the user, then go to the
// role's home page (or the ?redirect= target if it belongs to that role).
function useCompleteSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  return (res: ApiResponse<User>) => {
    const home = ROLE_HOME[res.data.role];
    const redirect = searchParams.get("redirect");

    queryClient.clear();
    queryClient.setQueryData(["user"], res);
    router.replace(redirect?.startsWith(home) ? redirect : home);
    router.refresh(); // lets the proxy see the new cookies
  };
}

export function useLogin() {
  const router = useRouter();
  const completeSignIn = useCompleteSignIn();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await userLogin(payload);
      return getMe();
    },
    onSuccess: completeSignIn,
    onError: (error, variables) => {
      const message = getErrorMessage(error);
      toast.error(message);

      // Backend answers 403 "Please verify your email..." for unverified users.
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

export function useGoogleOAuth() {
  const completeSignIn = useCompleteSignIn();

  return useMutation({
    mutationFn: async (payload: GoogleLoginPayload) => {
      await googleLogin(payload);
      return getMe();
    },
    onSuccess: completeSignIn,
    onError: (error) =>
      toast.error(
        getErrorMessage(error, "Google sign-in failed. Please try again."),
      ),
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: userRegister,
    onSuccess: (_res, variables) => {
      toast.success("Account created. Check your email for the 6-digit code.");
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

// Verifying the email also signs the user in (the backend sets the cookies).
export function useVerifyEmail() {
  const completeSignIn = useCompleteSignIn();

  return useMutation({
    mutationFn: async (payload: VerifyEmailPayload) => {
      await verifyEmail(payload);
      return getMe();
    },
    onSuccess: (res) => {
      toast.success("Email verified. Welcome to DevBench!");
      completeSignIn(res);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_res, variables) => {
      toast.success("If the email exists, a reset code has been sent.");
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password updated. You can log in now.");
      router.push("/login");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
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
