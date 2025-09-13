import React from 'react'

const Button = ( { children, active, linkto} ) => {
  return (
    <div>
      <Link to= {linkto}>
        <div className='text-center text-[14px] px-[6px] py-[3px] rounded-md font-bold'>
            {children}
        </div>

      </Link>
    </div>
  )
}

export default Button
