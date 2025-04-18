import React, { useEffect, useRef, useState } from 'react'
import { BsArrowLeft, BsBagPlus, BsBoundingBox, BsCardChecklist, BsCashCoin, BsChevronDown, BsCreditCard, BsGear, BsJournals, BsPentagonHalf, BsPeople, BsPerson, BsPersonPlus, BsReceiptCutoff, BsTruck } from 'react-icons/bs'
import { NavLink, useLocation } from 'react-router-dom'
import SidebarLinkGroup from './SidebarLinkGroup'
/* import TimeDate from './TimeDate' */

const Sidebar = ({sidebarOpen, setSidebarOpen}) => {
    const location = useLocation()
    const {pathname} = location

    const trigger = useRef(null)
    const sidebar = useRef(null)

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
    const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true')

    //close on click outside
    useEffect(() => {
        const clickHandler = ({target}) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
            return
            setSidebarOpen(false)
        }
        document.addEventListener('click', clickHandler)
        return () => document.removeEventListener('click', clickHandler)
    })

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({keyCode}) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        }
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    })

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded)
        if(sidebarExpanded) {
            document.querySelector('body').classList.add('sidebar-expanded')
        }
        else {
            document.querySelector('body').classList.remove('sidebar-expanded')
        }
    }, [sidebarExpanded])

  return (
    <aside ref={sidebar} className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* <!-- SIDEBAR HEADER --> */}
        <div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
            <NavLink to='/analytics'>
                <img src="/Media/Taurean IT Logo3-2_vectorized.png" className='w-full h-40' alt="Taurean IT Logo" />
            </NavLink>

            <button ref={trigger} onClick={() => setSidebarOpen(!sidebarOpen)} aria-controls='sidebar' aria-expanded = {sidebarOpen} className='block lg:hidden'>
                <BsArrowLeft className='fill-taureanDeepBlue' fill='none' size={24} />
            </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
            {/* <!-- Sidebar Menu --> */}
            <nav className='mt-5 py-4 px-4 lg:mt-9 lg:px-6'>

                {/* <!-- Menu Group --> */}
                <div>
{/*                     <div className='mb-3'>
                        <TimeDate />
                    </div> */}
                    <h3 className='mb-4 ml-4 text-sm font-semibold text-taureanDeepBlue'>ADMIN MENU</h3>

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        {/* <!-- Menu Item Dashboard --> */}
                        <SidebarLinkGroup activeCondition={pathname === '/' || pathname.includes('dashboard')}>
                            {(handleClick, open) => {
                                return (
                                    <React.Fragment> {/* I've placed this ";" in the 'navlink' let's see what happens? */}
                                        {/* <NavLink to='#' onClick={(e) => {e.preventDefault() 
                                            sidebarExpanded? handleClick(): setSidebarExpanded(true)}} className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-RhemaLime ${(pathname === '/' || pathname.includes('dashboard')) && 'bg-RhemaLime'}`}>
                                            <BsBoundingBox className='fill-current' size={24} fill='none' /> 
                                            Dashboard
                                            <BsChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`} fill='none' size={24} />
                                        </NavLink> */}

                                            {/* <!-- Dropdown Menu Start --> */}
                                            {/* <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                                                <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                                                    <li>
                                                        <NavLink to='/' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-RhemaLime ' + (isActive && '!text-RhemaLime')}>
                                                            Home
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div> */}
                                            
                                            {/* <!-- Dropdown Menu Start --> */}
                                    </React.Fragment>
                                )
                            }}
                        </SidebarLinkGroup>
                        {/* <!-- Menu Item Dashboard --> */}
                    </ul>

                </div>
                {/* <!-- Menu Group --> */}

                {/* Dashboard */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        <li>
                            <NavLink to='/analytics' className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${pathname.includes('analytics') && 'bg-taureanLightBlue text-white'}`}>
                                <BsBoundingBox className='fill-current' fill='none' size={24} />
                                Dashboard
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {/* Dashboard */}
                
                {/* <!-- Billing & Invoice --> */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        <li>
                            <NavLink to='/invoice' className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${pathname.includes('invoice') && 'bg-taureanLightBlue text-white'}`}>
                                <BsReceiptCutoff className='fill-current' fill='none' size={24} />
                                Billing & Invoice
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {/* <!-- Billing & Invoice --> */}

                {/* <!-- Payment & Receipt --> */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        <li>
                            <NavLink to='/receipt' className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${pathname.includes('receipt') && 'bg-taureanLightBlue text-white'}`}>
                                <BsCashCoin className='fill-current' fill='none' size={24} />
                                Payment & Receipt
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {/* <!-- Payment & Receipt --> */}                

                {/* New Submissions */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        <li>
                            <NavLink to='/vehicles' className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${pathname.includes('newsubmission') && 'bg-taureanLightBlue text-white'}`}>
                                <BsTruck className='fill-current' fill='none' size={24} />
                                Vehicles
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {/* New Submissions */}

                {/* Members */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        <li>
                            <NavLink to='/employee' className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${pathname.includes('employee') && 'bg-taureanLightBlue text-white'}`}>
                                <BsPeople className='fill-current' fill='none' size={24} />
                                Employees
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {/* Members */}

                {/* Reports & Evaluation */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        <li>
                            <NavLink to='/reportsandeval' className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${pathname.includes('reportsandeval') && 'bg-taureanLightBlue text-white'}`}>
                                <BsJournals className='fill-current' fill='none' size={24} />
                                Reports & Evaluation
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {/* Reports & Evaluation */}

                {/* <!-- Customers Test Group --> */}
                <div>
                    {/* <h3 className='mb-4 ml-4 text-sm font-semibold text-white'>MENU</h3> */}

                    <ul className='mb-6 flex flex-col gap-1.5'>
                        {/* <!-- Menu Item Dashboard --> */}
                        <SidebarLinkGroup activeCondition={pathname === '/' || pathname.includes('config')}>
                            {(handleClick, open) => {
                                return (
                                    <React.Fragment> {/* I've placed this ";" in the 'navlink' let's see what happens? */}
                                        <NavLink to='#' onClick={(e) => {e.preventDefault() 
                                            sidebarExpanded? handleClick(): setSidebarExpanded(true)}} className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:bg-taureanLightBlue hover:text-white ${(pathname === '/' || pathname.includes('dashboard')) && 'bg-taureanLightBlue text-white'}`}>
                                            <BsGear className='fill-current' size={24} fill='none' /> 
                                            Configurations
                                            <BsChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`} fill='none' size={24} />
                                        </NavLink>

                                            {/* <!-- Dropdown Menu Start --> */}
                                            <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                                                <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                                                    <li>
                                                        <NavLink to='/nextofkin' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:text-taureanDeepBlue ' + (isActive && '!text-taureanDeepBlue')}>
                                                            Next Of Kin
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to='/position' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:text-taureanDeepBlue ' + (isActive && '!text-taureanDeepBlue')}>
                                                            Positions
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to='/department' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:text-taureanDeepBlue ' + (isActive && '!text-taureanDeepBlue')}>
                                                            Departments
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to='/insurance' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:text-taureanDeepBlue ' + (isActive && '!text-taureanDeepBlue')}>
                                                            Insurance
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to='/roadworth' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:text-taureanDeepBlue ' + (isActive && '!text-taureanDeepBlue')}>
                                                            Vehicle Road Worth
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink to='/financialyearconfig' className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-taureanLightBlue duration-300 ease-in-out hover:text-taureanDeepBlue ' + (isActive && '!text-taureanDeepBlue')}>
                                                            Financial Year
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            {/* <!-- Dropdown Menu Start --> */}
                                    </React.Fragment>
                                )
                            }}
                        </SidebarLinkGroup>
                        {/* <!-- Menu Item Dashboard --> */}
                    </ul>

                </div>
                {/* <!-- Customers Test Group --> */}

            </nav>
            {/* <!-- Sidebar Menu --> */}
        </div>
    </aside>
  )
}

export default Sidebar
