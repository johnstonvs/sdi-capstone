import React, { useState, useEffect, useContext } from 'react';
import { LoggedInContext } from '../../App'

const ShipTo = ({ setLocation }) => {
  const [attics, setAttics] = useState([])
  const { loggedIn } = useContext(LoggedInContext)
  const [selectedAttic, setSelectedAttic] = useState(loggedIn.BOP ? loggedIn.BOP : null)

  useEffect(() => {
    fetch(`http://localhost:8080/attics`)
    .then(res => res.json())
    .then(data => setAttics(data))
    .catch(err => console.log(err))
  }, [])

  const handleAtticSelection = (event) => {
    setSelectedAttic(event.target.value);
    setLocation(event.target.value)
  }

  const handleDivClick = (atticLocation) => {
    setSelectedAttic(atticLocation);
    setLocation(atticLocation)
  }

  return (
    <div className='bg-white rounded shadow p-4 m-4 w-3/4 m-auto mt-10'>
      <h2 className='text-[#45A29E] text-3xl font-semibold mb-4 text-center' >Select an attic for shipping:</h2>
      {attics.map((attic) => (
        <div className='flex items-center bg-gray-300 gap-2 rounded shadow-md p-4 m-4 hover:scale-105' key={attic.location} onClick={() => handleDivClick(attic.location)}>
          <input
            type="radio"
            id={attic.location}
            name="attic"
            value={attic.location}
            checked={selectedAttic === attic.location}
            onChange={handleAtticSelection}
            className='text-[#45A29E]'
          />
          <label className='text-[#222222]' htmlFor={attic.id}>{attic.location}</label>
        </div>
      ))}
  </div>
  )
}

export default ShipTo