import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
<div className='NavbarContainer flex justify-between items-center bg-[#1F2833] p-4'>
  <div className='NavbarImageContainer flex items-center'>
    <img className='NavbarImage w-12 h-12' src='../assets/.jpg' alt="Airman's Attic Logo" />
  </div>
  <div className='NavbarLinksContainer flex gap-2'>
    <Link className='NavbarLinks rounded border-solid p-1 bg-[#C5C6C7] text-gray-800 hover:text-gray-600 px-2 py-1' to='/'>Home</Link>
    <Link className='NavbarLinks rounded border-solid p-1 bg-[#C5C6C7] text-gray-800 hover:text-gray-600 px-2 py-1' to='/shop'>Shop</Link>
    <Link className='NavbarLinks rounded border-solid p-1 bg-[#C5C6C7] text-gray-800 hover:text-gray-600 px-2 py-1' to='/location'>Location</Link>
    <Link className='NavbarLinks rounded border-solid p-1 bg-[#C5C6C7] text-gray-800 hover:text-gray-600 px-2 py-1' to='/patches'>Patches</Link>
    <Link className='NavbarLinks rounded border-solid p-1 bg-[#C5C6C7] text-gray-800 hover:text-gray-600 px-2 py-1' to='/about'>About</Link>
    <Link className='NavbarLinks rounded border-solid p-1 bg-[#C5C6C7] text-gray-800 hover:text-gray-600 px-2 py-1' to='/login'>Login</Link>
  </div>
</div>
  )
}

export default Navbar