import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    
    <div>
      <Link  to = {'/signup'}>Sign Up</Link>

      <div className='text-4xl text-center font-semibold mt-7'>
         Empower your future with 
         <HighlightText text={"Coding Skills"} />
      </div>
      <div>
        
      </div>
    </div>
    
  )
}

export default Home
