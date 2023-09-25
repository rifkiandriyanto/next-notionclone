import React, { createContext, useReducer, useEffect, ReactNode } from "react";

interface UserState {
  isAuth: boolean;
}

type UserAction = { type: "LOGIN" } | { type: "LOGOUT" };

interface UserProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

export const UserStateContext = createContext<UserState | undefined>(undefined);
export const UserDispatchContext = createContext<React.Dispatch<UserAction> | undefined>(
  undefined
);

const initialState: UserState = {
  isAuth: false,
};

const reducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "LOGIN": {
      return {
        isAuth: true,
      };
    }
    case "LOGOUT": {
      return {
        isAuth: false,
      };
    }
    default: {
      throw new Error("Unhandled action type.");
    }
  }
};

const UserProvider: React.FC<UserProviderProps> = ({
  children,
  isAuthenticated,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: "LOGIN" });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, [isAuthenticated]);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export default UserProvider;
