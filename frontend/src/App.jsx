import React, { useState } from "react";
import Users from "./components/users/users.jsx";
import Profile from "./components/profile/profile.jsx";
import Login from "./components/login.jsx";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleGoBack = () => {
    setSelectedUserId(null);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUserRole("user");
    //setUserRole(user.role);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setSelectedUserId(null);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Bienvenido</h1>
        <button onClick={handleLogOut} className="logout-button">
          Cerrar sesión
        </button>
      </header>
      <main className="main-container">
        <p style={{ color: "black" }}>
          Hola <strong>{userRole}</strong>
        </p>

        {selectedUserId ? (
          <>
            <button onClick={handleGoBack}>
              Volver a la lista de usuarios
            </button>
            <Profile userId={selectedUserId} />
          </>
        ) : (
          <Users
            onSelectUser={handleSelectUser}
            isUser={userRole === "user"}
            isAdmin={userRole === "admin"}
          />
        )}
      </main>
    </div>
  );
}

export default App;
