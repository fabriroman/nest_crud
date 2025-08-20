import React, { useState } from "react";
import Users from "./components/users/users.jsx";
import Profile from "./components/profile/profile.jsx";
import "./App.css";

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleGoBack = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="App">
      {selectedUserId ? (
        <>
          <button onClick={handleGoBack}>Volver a la lista de usuarios</button>
          <Profile userId={selectedUserId} />
        </>
      ) : (
        <Users onSelectUser={handleSelectUser} />
      )}
    </div>
  );
}

export default App;
