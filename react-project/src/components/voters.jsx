import React, { useState } from 'react'
import { FaEdit, FaPlus, FaPrint, FaShoePrints } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import votingData from '../datasource'

function Voters() {

    const [votes, setVotes] = useState(votingData.voters);
  return (
    <div className='main-table'>
      <div className="main-table-top">
        <div className="main-table-top-left">
          <button><FaPlus /> Add new post</button>
          <button><FaPrint /> Print</button>
        </div>
        <input type="search" name="" id="" placeholder='Search......' />
      </div>
      <div className="main-table-body">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
         <tbody>
            {votes.map((vote, index) => (
              <tr key={vote.id}>
                <td>{index + 1}</td>
                <td>{vote.name}</td> 
                <td>{vote.location}</td>
                <td>
                  <button className='edit'><FaEdit/> Edit</button>
                  <button className='delete'><FaDeleteLeft /> Delete</button>
                </td>
              </tr>
            ))}
         </tbody>
        </table>
      </div>
    </div >
  )
}

export default Voters
