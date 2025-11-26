import React, { use } from 'react';

const Users = ({usersPromise}) => {

    const users = use(usersPromise);
    console.log(users);
    return (
        <div>
            <h3>Users data</h3>
            {
                users.map(user => <p key={user.id}>{user.name} {user.email}</p>)
            }
        </div>
    );
};

export default Users;