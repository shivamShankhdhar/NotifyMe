import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
 const navIcons = [
  {src:"/assets/icons/search.svg",alt:"search",name:"search"},
  // {src:"/assets/icons/cart.svg",alt:"cart",name:"cart"},
  {src:"/assets/icons/user.svg",alt:"user",name:"user"},
  {src:"/assets/icons/black-heart.svg",alt:"heart",name:"black-heart"}
 ]
const Navbar = () => {
  return (
    <div>
      <header className='w-full '>
        <nav className='nav'>
          <Link href="/" className='flex items-center gap-1'>
            <Image src="/assets/icons/logo.svg" width={27} height={27}  alt="logo" />
            <h2 className='nav-logo'>
              Notify<span className='text-primary'>Me</span> 
            </h2>
            </Link> 
            <div className="flex items-center gap-5">
{navIcons.map((icon)=><Image key={icon.name} src={icon.src} alt={icon.alt} width={25} height={25} className='object-contain'/>)}
            </div>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
