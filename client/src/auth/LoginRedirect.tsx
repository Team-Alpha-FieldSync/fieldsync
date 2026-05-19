import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { LOGIN_MUTATION } from "../graphql/mutations";

import type { User } from "../types/auth";
import type {
  LoginMutationData,
  LoginMutationVariables,
} from "../graphql/types";

export default function useLoginRedirect() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation<
    LoginMutationData,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (!data) return;

      const user: User = {
        id: data.login.user.id,
        email: data.login.user.email,
        role: data.login.user.role,
      };

      login(data.login.token, user);
      console.log("ROLE FROM BACKEND:", data.login.user.role);
      // =========================
      // ROLE-BASED REDIRECT
      // =========================
      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;

        case "TECHNICIAN":
          navigate("/technician");
          break;

        default:
          navigate("*");
          break;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return {
    handleLogin,
    loading,
  };
}