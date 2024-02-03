import { Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/Index';
import Home from './components/Home';
import Users from './components/Users';

function App() {

  const fetchData = async () => {
    try {
      const response = await fetch('https://gorest.co.in/public/v2/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // You can process the data if needed
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="App">
      <Index />
      <Routes>
        <Route exact path='/all-users'>
          <Route path='/all-users' element={<Home fetchData={fetchData} />} />
          <Route path='/all-users/users' element={<Users />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
