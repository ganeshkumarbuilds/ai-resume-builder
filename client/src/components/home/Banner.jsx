import React from 'react'

const Banner = () => {
  return (
    <div className="w-full py-3.5 font-medium text-sm text-white text-center bg-gradient-to-r from-[#16d445] to-green-500 flex items-center justify-between px-6">
      <span className="bg-white text-green-600 font-bold text-xl px-3 py-1 rounded">Resume<span className="text-gray-800">AI</span></span>
      <p>
        <span className="px-3 py-1 rounded-lg text-white bg-green-700 mr-2">New</span>
        AI Feature Added
      </p>
      <div></div>
    </div>
  )
}

export default Banner