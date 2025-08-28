import UserItem from "./userItem";

const UserList = ({
  users,
  onEdit,
  onDelete,
  onView,
  isUser,
  isAdmin,
  currentUserId,
}) => {
  console.log("UserList props:", { users, isUser, isAdmin, currentUserId });
  if (users.length === 0) {
    return <p>No hay usuarios.</p>;
  }

  return (
    <ul>
      {users.map(
        (user) => (
          console.log("Rendering user:", user),
          (
            <UserItem
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              isUser={isUser}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
            />
          )
        )
      )}
    </ul>
  );
};

export default UserList;
