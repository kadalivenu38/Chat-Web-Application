import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Loading from './Loading'
import toast from 'react-hot-toast'

const Credits = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(null)
  const { axios, token, fetchUser } = useAppContext()

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/credits/plan')
      setPlans(data.plans || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (planId) => {
    try {
      setPurchasing(planId)
      const { data } = await axios.post('/credits/purchase', 
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        toast.error('Failed to initiate payment')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to purchase plan. Please try again.')
    } finally {
      setPurchasing(null)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>
        Credit Plans
      </h2>
      {plans.length > 0 ? (
        <div className='flex flex-wrap justify-center gap-8'>
          {plans.map((plan) => (
            <div key={plan._id} className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow hover:shadow-lg
              transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === 'pro' ? 
                "bg-purple-50 dark:bg-purple-900" : "bg-white dark:bg-transparent"}`}>
              <div className='flex-1'>
                <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
                <p className='text-2xl font-semibold text-purple-600 dark:text-purple-200 mb-4'>${plan.price}
                  <span className='text-base font-normal text-gray-600 dark:text-purple-200'>{' '}/ {plan.credits} credits</span>
                </p>
                <ul className='list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1'>
                  {plan.features && plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => handlePurchase(plan._id)}
                disabled={purchasing === plan._id}
                className='mt-6 bg-purple-600 dark:bg-purple-500 hover:bg-purple-800 active:bg-purple-800 text-white
                  font-medium py-2 rounded transition-colors cursor-pointer disabled:opacity-50'>
                {purchasing === plan._id ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 dark:text-purple-200'>No plans available</p>
      )}
    </div>
  )
}

export default Credits