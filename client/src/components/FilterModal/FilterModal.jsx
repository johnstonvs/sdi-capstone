import { useContext, useEffect } from 'react';
import { TagsContext } from '../../App.js';

const FilterModal = ({ baseList, show, handleClose, tag, setTag, bases, setBases, ship, setShip, price, setPrice }) => {
    const { tags } = useContext(TagsContext);

    return (
        show ?
            <div className='FilterContainer top-36 fixed z-10 inset-x-0 overflow-y-auto bg-white rounded-xl shadow-lg p-4 m-4 sm:m-auto sm:w-1/3'>
                <h1 className='FilterTitle text-[#45A29E] text-3xl font-semibold mb-4 text-center'>Filter By:</ h1>
                <div className='BaseContainer mb-5'>
                    <h3 className='BaseOptionsTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Bases:</ h3>
                    <div className='BaseOptions flex flex-row flex-wrap gap-3'>
                        {baseList.map((attic, index) => (
                            <label key={index} className='BaseLabel'>
                                {bases.includes(attic.id) ?
                                    <input type='checkbox'  className='Base bg-[#45A29E] mr-2' defaultChecked onClick={() => bases.includes(attic.id) ?
                                        setBases(prevBases => prevBases.filter(base => base !== attic.id)) :
                                        setBases([...bases, attic.id])} />
                                    : <input type='checkbox' key={index} className='Base bg-[#45A29E] mr-2' onClick={() => bases.includes(attic.id) ?
                                        setBases(prevBases => prevBases.filter(base => base !== attic.id)) :
                                        setBases([...bases, attic.id])} />}
                                {attic.location}
                            </ label>
                        ))}
                    </ div>
                </ div>
                <div className='PriceContainer mb-5' >
                    <h3 className='PriceTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Price:</ h3>
                    <div className='PriceOptions flex flex-row flex-wrap gap-3'>
                        {price === "Low to High" ?
                            <label className='PriceLabel'>
                                <input type='checkbox' defaultChecked className='LowToHigh bg-[#45A29E] mr-2' onClick={() => setPrice('Low to High')} />
                                <span>Low to High</ span>
                            </ label>
                            :
                            <label className='PriceLabel'>
                                <input type='checkbox' className='LowToHigh bg-[#45A29E] mr-2' onClick={() => setPrice('Low to High')} />
                                <span>Low to High</ span>
                            </ label>
                        }
                        {price === 'High to Low' ?
                        <label className='PriceLabel'>
                            <input type='checkbox' defaultChecked className='HighToLow bg-[#45A29E] mr-2' onClick={() => setPrice('High to Low')} />
                            <span>High to Low</ span>
                        </ label>
                        :
                        <label className='PriceLabel'>
                            <input type='checkbox'  className='HighToLow bg-[#45A29E] mr-2' onClick={() => setPrice('High to Low')} />
                            <span>High to Low</ span>
                        </ label>
                        }
                    </ div>
                </ div>
                <div className='CanShipOption mb-5'>
                    <h3 className='CanShipTitle text-[#45A29E] text-2xl font-semibold mb-4 text-left'>Can Ship:</ h3>
                    <label key={'shipNoShip'} className='CanShipLabel'>
                        {ship ?
                            <input type='checkbox' defaultChecked className='CanShip bg-[#45A29E] mr-2' onClick={() => ship === 'Can Ship' ?
                                setShip('') :
                                setShip('Can Ship')} />
                            : <input type='checkbox' className='CanShip bg-[#45A29E] mr-2' onClick={() => ship === 'Can Ship' ?
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
                                    <input type='checkbox'  defaultChecked className='TagOptions mr-2' onClick={() => tag.includes(iTag) ?
                                        setTag(prevTag => prevTag.filter(tag => tag !== iTag)) :
                                        setTag([...tag, iTag])} />
                                    : <input type='checkbox' className='TagOptions mr-2' onClick={() => tag.includes(iTag) ?
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