import React from 'react'


function GoogleLogin({ action, children }) {
  return (
    <div>
      <button onClick={action} variant="outline" className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2">
        {children}
      </button>
    </div>
  )
}

export default GoogleLogin
