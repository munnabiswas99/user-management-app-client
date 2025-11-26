import React, { use, useState } from "react";

const Users = ({ usersPromise }) => {
  const initialUsers = use(usersPromise);

  const [users, setUsers] = useState(initialUsers);
  console.log(users);


  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    console.log(name, email);

    const user = {name, email};

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        console.log('data after post', data)
        const newUsers = [...users, data];
        setUsers(newUsers);
        e.target.reset();
    })

  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name: </label>
        <input name="name" type="text" />
        <br />
        <label htmlFor="">Email: </label>
        <input name="email" type="email" />
        <br />
        <input type="submit" value="Add User" />
      </form>
      <h3>Users data</h3>
      {users.map((user) => (
        <p key={user.id}>
          {user.name} {user.email}
        </p>
      ))}
    </div>
  );
};

export default Users;
