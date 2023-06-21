import { useContext } from 'react';
import {TagsContext } from '../../App.js';

const FilterModal = ({baseList, show, handleClose, tag, setTag, bases, setBases, ship, setShip}) => {
    const {tags} = useContext(TagsContext);
    return (
        show ?
        <div className='FilterContainer top-1/4 fixed z-10 inset-0 overflow-y-auto bg-white rounded shadow p-4 m-4 sm:m-auto sm:w-1/3'>
            <h1 className='FilterTitle text-[#45A29E] text-3xl font-semibold mb-4 text-center'>Filter By:</ h1>
            <div className='BaseContainer'>
                <h3 className='BaseOptionsTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Bases:</ h3>
                <div className='BaseOptions flex flex-row flex-wrap gap-3'>
                    {baseList.map( (attic, index) => (
                        <label className='BaseLabel'>
                            <input type='checkbox' key={index} className='Base bg-[#45A29E]' onClick={() => bases.includes(attic.id) ?
                                bases.splice(bases.indexOf(attic.id), 1) :
                                setBases([...bases, attic.id])}/>
                            {attic.location}
                        </ label>
                    ))}
                </ div>
            </ div>
            <div className='CanShipOption'>
                <h3 className='CanShipTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Can Ship:</ h3>
                <label className='CanShipLabel'>
                    <input type='checkbox' className='CanShip bg-[#45A29E]' onClick={() => ship === 'Can Ship' ?
                        setShip('') :
                        setShip('Can Ship')}/>
                    Can Ship
                </ label>
            </ div>
            <div className='TagContainer'>
                <h3 className='TagOptionTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left' >Tags:</ h3>
                <div className='TagOptions  flex flex-row flex-wrap gap-3' >
                    {tags.map( (iTag, index) => (
                        <label className='TagOptionsLabel' >
                            <input type='checkbox' key={index} className='TagOptions' onClick={() => tag.includes(iTag) ?
                                 tag.splice(tag.indexOf(iTag), 1) :
                                setTag([...tag, iTag])}/>
                            {tag}
                        </ label>
                    ))}
                </ div>
            </ div>
            <button className='SubmitButt bg-[#45A29E] rounded border-solid text-gray-800 hover:scale-105 hover:scale-105 hover:bg-[#267458]' onClick={handleClose}>Filter</ button>
        </ div>
            : null
    )
}

export default FilterModal;