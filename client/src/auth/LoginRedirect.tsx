import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getLoginErrorMessage } from "./getLoginErrorMessage";
import { LOGIN_MUTATION } from "../graphql/mutations";
import type { User } from "../types/auth";
import type {
  LoginMutationData,
  LoginMutationVariables,
} from "../graphql/types";

export default function useLoginRedirect() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [loginMutation, { loading }] = useMutation<
    LoginMutationData,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const handleLogin = async (email: string, password: string) => {
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (!data) {
        setError("Login failed. Please try again.");
        return;
      }

      const user: User = {
        id: data.login.user.id,
        email: data.login.user.email,
        role: data.login.user.role,
      };

      login(data.login.token, user);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "TECHNICIAN":
          navigate("/technician");
          break;
        default:
          navigate("/unauthorized");
          break;
      }
    } catch (err) {
      setError(getLoginErrorMessage(err));
    }
  };

  return {
    handleLogin,
    loading,
    error,
  };
}