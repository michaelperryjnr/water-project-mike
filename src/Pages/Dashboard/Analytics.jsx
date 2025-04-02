import React from 'react'
import DefaultLayout from '../../Layout/DefaultLayout'
import CardOne from '../../Components/AnalyticsCards/CardOne'
import CardTwo from '../../Components/AnalyticsCards/CardTwo'
import CardThree from '../../Components/AnalyticsCards/CardThree'
import CardFour from '../../Components/AnalyticsCards/CardFour'
import DailySalesChart from '../../Components/AnalyticsCharts/DailySalesChart'
import FinancesChart from '../../Components/AnalyticsCharts/FinancesChart'
import SupplierExpensesChart from '../../Components/AnalyticsCharts/SupplierExpensesChart'

function Analytics() {
  return (
    <DefaultLayout>
      {/* Card Information */}
      <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-white rounded-t-md'>
        <div className='grid sm:grid-cols-4 border-y border-gray-200'>
          <CardOne />
          <CardTwo />
          <CardThree />
          <CardFour />
        </div>
      </div>
      {/* Card Information */}

      {/* Charts */}
      <div className='mt-3 grid grid-cols-12 gap-4 md:gap-6'>
        <div className='col-span-12 space-y-6 xl:col-span-7'>
          <DailySalesChart />
        </div>

        <div className='col-span-12 space-y-5 xl:col-span-5'>
          <FinancesChart />
          <SupplierExpensesChart />
        </div>
      </div>
      {/* Charts */}

      {/* Table Information */}
      <div className='mt-4 grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        {/* <TableOne /> */}
      </div>
      {/* Table Information */}

    </DefaultLayout>
  )
}

export default Analytics
