import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { FaDashcube, FaHome, FaUser, FaUserAlt, FaUserFriends, FaVoteYea } from 'react-icons/fa'

import Dashboard from './components/dashboard'
import usePagestore from './store/pagestore';
import Position from './components/position';
import Candidate from './components/candidate';
import Voters from './components/voters';

function App() {

  const { page } = usePagestore();

  return (
    <div className='container'>
      <main>
        <input type="checkbox" name="" id="humberg" />
        <div className="left-sidebar">
          <div className="left-sidebar-title">
            <FaVoteYea size={35} />AVMS
          </div>
          <div className="left-menu">
            <Link className="menu-item" to="/dashboard">
              <FaDashcube />dashboard
            </Link>
            <Link className="menu-item" to="/position">
              <FaUserFriends />position
            </Link>
            <Link className="menu-item" to="/candidate"  >
              <FaUserFriends />candidate
            </Link>
            <Link className="menu-item" to="/election">
              <FaUser />Election
            </Link>
            <Link className="menu-item" to="/voters">
              <FaUser />voters
            </Link>
            <Link className="menu-item" to="/result">
              <FaUserFriends />result
            </Link>
            <Link className="menu-item" to="/calender">
              <FaUserFriends />calender
            </Link>
          </div>
        </div>
        <div className="right-sidebar">
          <div className="top">
            <div className="top-left"><label htmlFor="humberg">&#9776;</label> {page}
            </div>
            <div className="top-right">

              <img src="profile.jpeg" className='profile-pic' />
              <span>ABAFASHIJWENIMANA Donatien</span>
            </div>
          </div>
          <Routes className="main">
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/position' element={<Position />} />
            <Route path='/candidate' element={<Candidate />} />
            <Route path='/voters' element={<Voters />} />
          </Routes>
        </div>
      </main>
      <footer className="footer">Automated Voting Management system &copy;</footer>
    </div>
  )
}

export default App
