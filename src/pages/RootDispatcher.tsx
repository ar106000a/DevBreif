import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import App from "./App";
import Landing from "./Landing";

export const RootDispatcher = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner label="Loading" />;

  return user ? <App /> : <Landing />;
};
