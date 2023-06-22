import { useContext, useEffect } from 'react';
import { TagsContext } from '../../App.js';

const FilterModal = ({ baseList, show, handleClose, tag, setTag, bases, setBases, ship, setShip }) => {
    const { tags } = useContext(TagsContext);

    return (
        show ?
            <div className='FilterContainer top-1/4 fixed z-10 inset-0 overflow-y-auto bg-white rounded shadow p-4 m-4 sm:m-auto sm:w-1/3'>
                <h1 className='FilterTitle text-[#45A29E] text-3xl font-semibold mb-4 text-center'>Filter By:</ h1>
                <div className='BaseContainer mb-5'>
                    <h3 className='BaseOptionsTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Bases:</ h3>
                    <div className='BaseOptions flex flex-row flex-wrap gap-3'>
                        {baseList.map((attic, index) => (
                            <label key={index} className='BaseLabel'>
                                {bases.includes(attic.id) ?
                                    <input type='checkbox'  className='Base bg-[#45A29E]' defaultChecked onClick={() => bases.includes(attic.id) ?
                                        setBases(prevBases => prevBases.filter(base => base !== attic.id)) :
                                        setBases([...bases, attic.id])} />
                                    : <input type='checkbox' key={index} className='Base bg-[#45A29E]' onClick={() => bases.includes(attic.id) ?
                                        setBases(prevBases => prevBases.filter(base => base !== attic.id)) :
                                        setBases([...bases, attic.id])} />}
                                {attic.location}
                            </ label>
                        ))}
                    </ div>
                </ div>
                <div className='CanShipOption mb-5'>
                    <h3 className='CanShipTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Can Ship:</ h3>
                    <label key={'shipNoShip'} className='CanShipLabel'>
                        {ship ?
                            <input type='checkbox' defaultChecked className='CanShip bg-[#45A29E]' onClick={() => ship === 'Can Ship' ?
                                setShip('') :
                                setShip('Can Ship')} />
                            : <input type='checkbox' className='CanShip bg-[#45A29E]' onClick={() => ship === 'Can Ship' ?
                                setShip('') :
                                setShip('Can Ship')} />}

                        Can Ship
                    </ label>
                </ div>
                <div className='TagContainer mb-5'>
                    <h3 className='TagOptionTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left' >Tags:</ h3>
                    <div className='TagOptions  flex flex-row flex-wrap gap-3' >
                        {tags.map((iTag, index) => (
                            <label key={iTag} className='TagOptionsLabel' >
                                {tag.includes(iTag) ?
                                    <input type='checkbox'  defaultChecked className='TagOptions' onClick={() => tag.includes(iTag) ?
                                        setTag(prevTag => prevTag.filter(tag => tag !== iTag)) :
                                        setTag([...tag, iTag])} />
                                    : <input type='checkbox' className='TagOptions' onClick={() => tag.includes(iTag) ?
                                        setTag(prevTag => prevTag.filter(tag => tag !== iTag)) :
                                        setTag([...tag, iTag])} />}

                                {iTag}
                            </ label>
                        ))}
                    </ div>
                </ div>
                <button className='SubmitButt bg-[#2ACA90] mt-5 text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={handleClose}>Filter</ button>
            </ div>
            : null
    )
}

export default FilterModal;