import { useEffect, useRef, useState } from 'react'
import { BsBoxArrowLeft, BsChevronDown, BsGear, BsJournal, BsPerson } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const trigger = useRef(null)
    const dropdown = useRef(null)
    
    //close on click outside
    useEffect(() => {
        const clickHandler = ({target}) => {
            if (!dropdown.current) return
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
             return 
            setDropdownOpen(false)
        }
        document.addEventListener('click', clickHandler)
        return () => document.removeEventListener('click', clickHandler)
    })

    //close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({keyCode}) => {
            if(!dropdownOpen || keyCode !== 27) return
            setDropdownOpen(false)
        }
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    })


  return (
    <div className='relative'>
      <Link ref={trigger} onClick={() => setDropdownOpen(!dropdownOpen)} className='flex items-center gap-4' to='#' >
        <span className='hidden text-right lg:block'>
            <span className='block text-sm font-medium text-black'>User Name</span>
            <span className='block text-xs'>User Role</span>
        </span>

        <span className='h-12 w-12 rounded-full'>
            <img src="/vite.svg" alt="User-Image" />
        </span>

        <BsChevronDown className='hidden fill-current sm:block' size={15} />

      </Link>

      {/* <!-- Dropdown Start --> */}

      <div ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)} className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-RoyalGold bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'}`}>
            <ul className='flex flex-col gap-5 border-b border-RoyalGold px-6 py-7.5'>

                <li>
                    <Link to='/profile' className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-RoyalPurple lg:text-base'>
                    <BsPerson className='fill-current' fill='none' size={22} />
                    User Profile
                    </Link>
                </li>

                {/* <li>
                    <Link to='' className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-RoyalPurple lg:text-base'>
                        <BsJournal className='fill-current' fill='none' size={22} />
                        Settings
                    </Link>
                </li> */}

                {/* <li>
                    <Link to='' className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-RoyalPurple lg:text-base'>
                        <BsGear className='fill-current' fill='none' size={22} />
                        something
                    </Link>
                </li> */}

            </ul>

            <Link to={'/'} className='flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-RoyalPurple lg:text-base'>
                <BsBoxArrowLeft className='fill-current' fill='none' size={22} />
                Logout
            </Link>
        </div>
        {/* <!-- Dropdown End --> */}
    </div>
  )
}

export default DropdownUser
