const UserProfileInfo = ({ user }) => {
  return (
    <div className="user-info">
      <h3>
        {user.firstName} {user.lastName}
      </h3>
      <p>Email: {user.email}</p>
      <p>Teléfono: {user.phone}</p>
    </div>
  );
};

export default UserProfileInfo;
