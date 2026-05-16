import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  
   // const [user, setUser] = useState<User | null>(null);
  //The line of code above initializes a state variable called "user" using
  //  the useState hook. The initial value of "user" is set to null, 
  // indicating that there is no authenticated user when the application starts.
  //  The setUser function is used to update the value of "user" when a user logs in or logs out.
  //It is currentenly replaced with a default user for development purposes, 
  // allowing us to simulate an authenticated state without implementing the full login functionality.

    // For development purposes, we can set a default user 
    // to simulate an authenticated state.
     const [user, setUser] = useState<User | null>({
    id: "1",
    email: "admin@test.com",
    role: "admin",
        });
  
  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}