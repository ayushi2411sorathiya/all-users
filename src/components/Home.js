// Home.js
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';

const Home = ({ fetchData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male',
    status: 'active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = 'e351c5a3bdd561f9c6f9a687f7007b9716617e680c8da39da9b587aee4733ce9'; // Replace with your access token

      if (!navigator.onLine) {
        // If offline, store the data in local storage
        const offlineData = JSON.parse(localStorage.getItem('offlineData')) || [];
        localStorage.setItem('offlineData', JSON.stringify([...offlineData, formData]));
        console.log('Data stored offline:', formData);
        setFormData({
          name: '',
          email: '',
          gender: '',
          status: '',
        })
        // Optionally, you can update the UI to indicate that the data is stored offline
        return;
      }

      const response = await fetch('https://gorest.co.in/public/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add data. Server responded with ${response.status}`);
      }

      // Clear the form
      setFormData({ name: '', email: '', gender: '', status: '' });

      // Fetch data from API
      fetchData();

      // Check if there's any offline data to sync
      const offlineData = JSON.parse(localStorage.getItem('offlineData')) || [];
      if (offlineData.length > 0) {
        await syncOfflineData(offlineData);
      }
      localStorage.removeItem('offlineData'); // Clear locally saved offline data after sync
    } catch (error) {
      console.error('Add data error:', error);
    }
  };

  const syncOfflineData = async (offlineData) => {
    try {
      const accessToken = 'e351c5a3bdd561f9c6f9a687f7007b9716617e680c8da39da9b587aee4733ce9'; // Replace with your access token

      // Attempt to add each offline item to the API
      for (const data of offlineData) {
        const response = await fetch('https://gorest.co.in/public/v2/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to sync offline data');
        }
      }
    } catch (error) {
      console.error('Sync offline data error:', error);
    }
  };

  useEffect(() => {
    // Check for and sync offline data on component mount
    const offlineData = JSON.parse(localStorage.getItem('offlineData')) || [];
    if (offlineData.length > 0) {
      syncOfflineData(offlineData);
    }

    // Periodically check for network connectivity and sync offline data
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        const storedOfflineData = JSON.parse(localStorage.getItem('offlineData')) || [];
        if (storedOfflineData.length > 0) {
          syncOfflineData(storedOfflineData);
          localStorage.removeItem('offlineData'); // Clear locally saved offline data after sync
        }
      }
    }, 5000); // Adjust the interval as needed (e.g., check every 5 seconds)

    return () => clearInterval(syncInterval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Full name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email Address"
                />
              </FormGroup>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  placeholder="gender"
                />
              </FormGroup>
              <FormGroup>
                <Label for="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  placeholder="Status"
                />
              </FormGroup>
              <Button type="submit">Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
