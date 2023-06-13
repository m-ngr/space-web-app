import { Dispatch, SetStateAction, createContext, useState } from "react";

export type IUserContext = {
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
};

export const UserContext = createContext<IUserContext | undefined>(undefined);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const userContextValue = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
