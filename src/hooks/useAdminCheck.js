import { useAuth } from "../context/AuthContext";

export const useAdminCheck = () => {
  const { usuario } = useAuth(); 

  const adminEmails = ["faculez07@gmail.com", "tripdrusgtore@gmail.com","rodolfo@gmail.com"];

  const isAuthenticated = !!usuario;
  const loading = usuario === null; 

  const isAdmin = isAuthenticated && adminEmails.includes(usuario.email);

  return { isAdmin, isAuthenticated, loading };
};
