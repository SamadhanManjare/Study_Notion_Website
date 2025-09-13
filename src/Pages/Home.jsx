import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (

    <div>

    { /* Section 1 */}
    
    <div>
      <Link  to = {'/signup'}>Sign Up</Link>

      <div className='text-4xl text-center font-semibold mt-7'>
         Empower your future with 
         <HighlightText text={"Coding Skills"} />
      </div>

      <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace,
            from anywhere in the world. Our expert instructors will guide you
            through hands-on projects and real-world scenarios to help you
            build the skills you need to succeed in today's tech-driven world.
      </div>

      <div className='flex flex-row gap-7 mt-8'>
        <CTAButton>
            Learn More
        </CTAButton>
        <CTAButton>
            Book a Demo
        </CTAButton>

      </div>
    </div>

    //Section 2


  </div>
    
  )
}

export default Home
