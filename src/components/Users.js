import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Table } from 'reactstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://gorest.co.in/public/v2/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Save data to localStorage
      localStorage.setItem('allUsers', JSON.stringify(data));

      setUsers(data);
      setIsOffline(false);
    } catch (error) {
      // If the network request fails, try to retrieve data from localStorage
      const savedData = JSON.parse(localStorage.getItem('allUsers')) || [];
      console.log('Data retrieved from localStorage:', savedData);
      setUsers(savedData);
      setIsOffline(true);
    }
  };

  const syncDeletedItems = async (deletedItems) => {
    try {
      const accessToken = 'e351c5a3bdd561f9c6f9a687f7007b9716617e680c8da39da9b587aee4733ce9'; // Replace with your actual access token

      // Attempt to delete each item from the API
      for (const userId of deletedItems) {
        const response = await fetch(`https://gorest.co.in/public/v2/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error(`Failed to sync deletion for user ${userId}`);
        }
      }
    } catch (error) {
      console.error('Sync deleted items error:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const accessToken = 'e351c5a3bdd561f9c6f9a687f7007b9716617e680c8da39da9b587aee4733ce9'; // Replace with your actual access token

      // Online mode: Send DELETE request to the API
      const response = await fetch(`https://gorest.co.in/public/v2/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // If offline, store the deletion info for later sync
        if (navigator.onLine) {
          throw new Error('Failed to delete user');
        }

        const deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || [];
        localStorage.setItem('deletedItems', JSON.stringify([...deletedItems, userId]));
      }

      // Update the UI by fetching data again
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      setIsOffline(true);
    }
  };

  // Check if there are any offline deletions to sync
  useEffect(() => {
    const deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || [];
    if (deletedItems.length > 0) {
      syncDeletedItems(deletedItems);
      localStorage.removeItem('deletedItems'); // Clear locally saved deleted items after sync
    }
  }, []);

  return (
    <div>
      {isOffline && (
        <p className="text-danger text-center">You are offline, Please check your internet connection.</p>
      )}

      <Container>
        <Row>
          <Col>
            <Table bordered hover responsive striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">{user.id}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.status}</td>
                    {/* <td>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Users;
