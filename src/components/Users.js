import React from 'react';
import { Table } from 'reactstrap';
import { useEffect, useState } from 'react';

const Users = () => {

    const [users, setUsers] = useState([]);
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
            localStorage.setItem("allUsers", JSON.stringify(data))
        } catch (error) {
            let userData = localStorage.getItem("allUsers")
            setUsers(JSON.parse(userData))
            setIsOffline(true)
            console.error('Fetch error:', error);
        }
    };

    return (
        <div>
            {
                isOffline ? <p className='text-danger'>You are offline, Please check your internet connection.</p> : null
            }

            <Table
                bordered
                hover
                responsive
                striped
            >
                <thead>
                    <tr>
                        <th># </th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Website</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{user.id}</th>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.website}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default Users