import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PatchCard, UploadPatch, Loader } from '../../components/index';
import { LoggedInContext, LoadingContext } from '../../App';
import Patch from './Patch';

const Patches = () => {
  const [patches, setPatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTyped, setSearchTyped] = useState(false);
  const [filteredPatches, setFilteredPatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:8080/patches')
      .then(res => res.json())
      .then(data => {
        setPatches(data)
        setLoading(false)}
        )
      .catch(err => console.error(err))
  }, [isModalOpen]);

  useEffect(() => {
    setFilteredPatches(
      patches.filter((patch) =>
        patch.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, patches])

  const searchBarChange = (e) => {
    setSearchTerm(e.target.value)

    if (e.target.value !== '') {
      setSearchTyped(true)
    } else {
      setSearchTyped(false)
    }
  }

  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
      <Loader />
      </div>
    ) : (

<div className='PatchesPageContainer mt-28 mb-20'>
      <div className='PatchesSearchBarContainer'>
        <input className='LocationsSearchBar w-full mt-5 p-2 bg-white shadow mt-1'
          placeholder='Enter a patch name...'
          value={searchTerm}
          onChange={searchBarChange} />
        {searchTyped ?
          (
            filteredPatches.map((patch) => {
            return <p className='SearchResult bg-white cursor-pointer p-2 shadow' onClick={() => setSearchTerm(patch.name)}>{patch.name}</p>
        })
        ) : null}
        <button className='bg-[#2ACA90] mt-5 ml-4 text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={openModal}>Upload a Patch!</button>
      </div>
      <div className='PatchesContainer grid grid-cols-5 grid-rows-5 gap-x-10 gap-y-20 m-4 mt-10'>
        {filteredPatches ? filteredPatches.map((patch, index) => (
          <Link to={{pathname: `/patches/patch/${patch.id}`}} key={index} className='Patch' >
            <PatchCard patch={patch} />
          </Link>
        )) : null}
      </div>
      <UploadPatch isOpen={isModalOpen} closeModal={closeModal} />
    </div>
    )

  )
}

export default Patches;

/*
1. User must be logged in to ship
2. Searchbar
*/