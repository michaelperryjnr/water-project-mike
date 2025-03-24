import React from 'react'
import DefaultLayout from '../../Layout/DefaultLayout'
/* import CardOne from '../../Components/CardOne'
import CardTwo from '../../Components/CardTwo'
import CardThree from '../../Components/CardThree'
import CardFour from '../../Components/CardFour'
import CardFive from '../../Components/CardFive'
import TableOne from '../../Components/TableOne'
import PrelineCardOne from '../../Components/PrelineCardOne'
import PrelineCardTwo from '../../Components/PrelineCardTwo'
import PrelineCardThree from '../../Components/PrelineCardThree'
import PrelineCardFour from '../../Components/PrelineCardFour' */

function Analytics() {
  return (
    <DefaultLayout>
      {/* Card Information */}
      {/* <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
            <CardOne />
            <CardTwo />
            <CardThree />
            <CardFour />
            <CardFive />
           </div> */}
      <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-white rounded-t-md'>
        <div className='grid sm:grid-cols-4 border-y border-gray-200'>
{/*           <PrelineCardOne />
          <PrelineCardTwo />
          <PrelineCardThree />
          <PrelineCardFour /> */}
        </div>
      </div>
      {/* Card Information */}

      {/* Table Information */}
      <div className='mt-4 grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        {/* <TableOne /> */}
      </div>
      {/* Table Information */}

    </DefaultLayout>
  )
}

export default Analytics
