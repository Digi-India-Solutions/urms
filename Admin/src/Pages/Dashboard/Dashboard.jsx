import React from 'react'

const Dashboard = () => {
  const name = sessionStorage.getItem("name")
  return (
    <>
      <div className='text-center mt-2'>
      <h2>Welcome to {name} in Admin Panel !!!!!!</h2>
      </div>
    </>
  )
}

export default Dashboard