import logo from './logo.svg';
import './App.css';
import React,{Component} from 'react';
import Navbar from './components/Navbar';
import Next from './components/Next';
function App() {
  return (
    <div className="App">
     <Navbar/>
     <Next/>
    </div>
  );
}

export default App;
