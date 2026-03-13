import React from 'react'
import { FaEdit, FaPlus, FaPrint, FaShoePrints } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import votingData from '../datasource'
import usePagestore from '../store/pagestore'

function Candidate() {
    const {changepage} = usePagestore()
    // changepage('candidate')
    const [candidates, setCandidates] = React.useState(votingData.candidates);

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
              <th>Candidate Name</th>
              <th>Party</th>
                <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={candidate.id}>
                <td>{index + 1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.party}</td>
                <td>{votingData.posts.find(post => post.id === candidate.postId)?.title || 'Unknown'}</td>
                <td>
                  <button className='edit'><FaEdit /> Edit</button>
                  <button><FaDeleteLeft className='delete' /> Delete</button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div >
  )
}


export default Candidate
