import { useState } from 'react'
import './App.css'
import { FaDashcube, FaHome, FaUser, FaUserAlt, FaUserFriends, FaVoteYea } from 'react-icons/fa'

import Dashboard from './components/dashboard'

function App() {
  return (
    <div className='container'>
      <div className="left-sidebar">
        <div className="left-sidebar-title">
          <FaVoteYea size={35} />AVMS
        </div>
        <div className="left-menu">
          <div className="menu-item">
            <FaDashcube />dashboard
          </div>
          <div className="menu-item">
            <FaUserFriends />position
          </div>
          <div className="menu-item">
            <FaUserFriends />candidate
          </div>
          <div className="menu-item">
            <FaUser />Election
          </div>
          <div className="menu-item">
            <FaUser />voters
          </div>
          <div className="menu-item">
            <FaUserFriends />result
          </div>
          <div className="menu-item">
            <FaUserFriends />calender
          </div>
        </div>
      </div>
      <div className="right-sidebar">
        <div className="top">
          <div className="top-left">Dashboard
          </div>
          <div className="top-right">

            <img src="profile.jpeg" alt="" srcset="" className='profile-pic' />
            <span>ABAFASHIJWENIMANA Donatien</span>
          </div>
        </div>
        <main className="main">
          <Dashboard />
        </main>
      </div>
      <footer className="footer">Automated Voting Management system &copy;</footer>
    </div>
  )
}

export default App
