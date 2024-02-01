import { Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/Index';
import Home from './components/Home';
import Users from './components/Users';

function App() {


  return (
    <div className="App">
      <Index />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/users' element={<Users />} />
      </Routes>

    </div>
  );
}

export default App;
