import { createContext } from "react";

export const AuthContext = createContext({
  authState: {
    email: "",
    id: "",
    status: false,
  },
  setAuthState: () => {}, // This function will be replaced when you provide the actual implementation
});