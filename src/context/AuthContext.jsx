import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "sch_users";
const CURRENT_USER_KEY = "sch_current_user";

const demoUsers = [
  {
    id: "user-demo",
    name: "Demo Student",
    email: "demo@studenthub.com",
    password: "password123",
    course: "Software Engineering",
    role: "Student",
  },
  {
    id: "user-2",
    name: "Amina Hassan",
    email: "amina@studenthub.com",
    password: "password123",
    course: "Frontend Development",
    role: "Group Leader",
  },
];

function getStoredValue(key, fallback) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => getStoredValue(USERS_KEY, demoUsers));
  const [currentUser, setCurrentUser] = useState(() =>
    getStoredValue(CURRENT_USER_KEY, null)
  );

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      users,
      isAuthenticated: Boolean(currentUser),
      login: ({ email, password }) => {
        const matchedUser = users.find(
          (user) =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );

        if (!matchedUser) {
          return {
            success: false,
            message: "Wrong email or password. Try the demo account to explore.",
          };
        }

        setCurrentUser(matchedUser);

        return { success: true };
      },
      register: ({ name, email, course, password }) => {
        const exists = users.some(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
          return {
            success: false,
            message: "That email is already registered. Please log in instead.",
          };
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          course,
          role: "Student",
        };

        setUsers((previousUsers) => [...previousUsers, newUser]);
        setCurrentUser(newUser);

        return { success: true };
      },
      logout: () => setCurrentUser(null),
    }),
    [currentUser, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
