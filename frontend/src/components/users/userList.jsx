import UserItem from "./userItem";

const UserList = ({ users, onEdit, onDelete, onView }) => {
  if (users.length === 0) {
    return <p>No hay usuarios.</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </ul>
  );
};

export default UserList;
