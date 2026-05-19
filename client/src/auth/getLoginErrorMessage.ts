export function getLoginErrorMessage(error: unknown): string {
    if (
      error &&
      typeof error === "object" &&
      "graphQLErrors" in error &&
      Array.isArray((error as { graphQLErrors: unknown }).graphQLErrors)
    ) {
      const first = (
        error as { graphQLErrors: Array<{ message?: string }> }
      ).graphQLErrors[0];
      if (first?.message) return first.message;
    }
  
    if (error instanceof Error && error.message) {
      return error.message;
    }
  
    return "Invalid email or password. Please try again.";
  }