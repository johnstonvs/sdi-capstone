import { useState, useEffect } from 'react';
import {RatingForm} from '../../components/index'

const Locations = () => {
  const [attics, setAttics] = useState([])
  const [selectedAttic, setSelectedAttic] = useState()
  const [filteredAttics, setFilteredAttics] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTyped, setSearchTyped] = useState(false)

  const fetchAttics = () => {
    fetch('http://localhost:8080/attics')
    .then(res => res.json())
    .then(data => setAttics(data))
  }

  const searchBarChange = (e) => {
    setSearchTerm(e.target.value)

    if (e.target.value !== '') {
      setSearchTyped(true)
    } else {
      setSearchTyped(false)
    }
  }

  const selectChange = (e) => {
    const selectedAtticLocation = e.target.value;
    const selectedAttic = attics.find(attic => attic.location === selectedAtticLocation);
    setSelectedAttic(selectedAttic)
  }

  useEffect(() => {
    fetchAttics()
  },[])

  useEffect(() => {
    setFilteredAttics(
      attics.filter((attic) =>
        attic.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, attics])

  return (
    <div className='LocationsContainer'>
      {selectedAttic ? (
        <>
        <div className='LocationAbout'>
          <h1 className='LocationHeader'>{selectedAttic.location}</h1>
          <div className='LocationContactContainer'>
            <p className='LocationPhone'>{selectedAttic.phone}</p>
            <p className='LocationEmail'>{selectedAttic.email}</p>
            <p className='LocationAddress'>{selectedAttic.address}</p>
          </div>
          <p className='LocationContent'>{selectedAttic.about}</p>
          <button className='BackButton' onClick={()=> setSelectedAttic('')}>Back</button>
        </div>
        <RatingForm />
        </>
      )
      :
      (<div className='LocationsSearchContainer'>
        <div className='LocationsDropDownContainer'>
          {attics ? (
             <select className='LocationsDropDown' onChange={selectChange}>
                <option className='AtticOption'></option>
                {attics.map((attic) => {
                  return (
                  <>
                  <option className='AtticOption' value={attic.location}>{attic.location}</option>
                  </>)
                })}
             </select>
             ) : (
             <p>There are no avalible attics to view... Try again later...</p>
             )}
        </div>
        <div className='LocationsSearchBarContainer'>
        <input className='LocationsSearchBar'
                 placeholder='Enter a base...'
                 value={searchTerm}
                 onChange={searchBarChange} />
          {searchTyped ? (
            filteredAttics.map((attic) => {
            return <p className='bg-white' onClick={() => setSelectedAttic(attic)}>{attic.location}</p>
          })
          ) : null}
        </div>
      </div>)}

    </div>
  )
}

export default Locations;