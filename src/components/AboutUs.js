import React from 'react'
import video from '../video/Screen Recording 2025-06-02 175140.mp4'
import ours from '../images/ours.png'

export default function AboutUs() {
  return (
    <>
        <div className='bg-gray-800 text-white h-full px-6 py-4'>
            {/* about our project video */}
            <div className='my-10 flex justify-center'>
                <video class="h-auto w-3/4 rounded-lg" controls>
                    <source src={video} type="video/mp4"/>Your browser does not support the video tag.
                </video>
            </div>

            {/* The Problem We're Solving */}
            <h1 className='text-center font-bold text-3xl pb-8'>The Problem We're Solving</h1>
            <div className="container mx-auto w-auto mr-32 ml-32 bg-[#333f4b] rounded-xl p-10 text-justify mb-12 text-slate-300">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus corrupti molestias magnam, ullam debitis nobis sint ipsum et quam expedita saepe nisi ducimus soluta iusto. Libero pariatur, aspernatur, repudiandae repellendus excepturi nostrum at possimus eaqueelectus corrupti repellat incidunt eveniet provident fugit perferendis hic nemo sed consequatur, perspiciatis vel sit dolores minima.</p><br />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dusto. Libero pariatur, aspernatur, repudiandae repellendus excepturi nostrum at possimus eaque repellat  molestias magnam, ullam debitis nobis sint ipsum et quam expedita saepe nisi ducimus soluta i incidunt eveniet nemo sed consequatur, perspiciatis vel sit dolores minima.</p><br />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus corrupti molestias magnam, ullam debitis nobis sint ipsum et quam expedita saepe nisi ur, repudiandae repellendus excepturi nostrum at possimus eaque repellat incidunt eveniet provident fugit perferendis hic nemo sed consequatur, perspiciatis vel sit dolores minima.</p><br />
                <p>Lorem ipsum  incidunt eveniet provident fugit perferendis hic nemo sed consequatur, perspiciatis vel sit dolores minima.</p>
            </div>

            {/* About us */}
            <h1 className='text-center text-2xl font-bold pb-8'>About Us</h1>
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 ml-7 justify-center">
                {/* Left: Image */}
                <img src={ours} alt="Team Selfie" className="w-80 h-auto rounded-2xl shadow-lg"/>
                {/* Right: Text */}
                <div className="text-white max-w-xl">
                    <p className="mb-4">We're grateful to those who've supported and encouraged us in our journey so far.</p>
                    <p className="mb-4">We're Vardhan and Siddharth—two students at BITS Pilani, Hyderabad, brought together by Ultimate Frisbee and a shared love for building things.</p>
                    <p className="mb-4">Vardhan chases what excites him—startups, research, and deep conversations. When he's not knee-deep in projects, he's running, swimming, or leveling up at squash. He's a dog person, a softie fan, and believes learning happens best by doing.</p>
                    <p className="mb-4">We're grateful to those who've supported and encouraged us in our journey so far.</p>
                    <p className="mb-4">We're Vardhan and Siddharth—two students at BITS Pilani, Hyderabad, brought together by Ultimate Frisbee and a shared love for building things.</p>
                </div>
            </div>

            {/* Our Story (website) */}
            <div className="container mx-auto w-auto mr-32 ml-32 bg-[#333f4b] rounded-xl p-10 text-justify mb-10 text-slate-300">
                <h1 className='font-bold text-3xl pb-8 text-white'>The Story Of This Website</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus corrupti molestias magnam, ullam debitis nobis sint ipsum et quam expedita saepe nisi ducimus soluta iusto. Libero pariatur, aspernatur, repudiandae repellendus excepturi nostrum at possimus eaqueelectus corrupti repellat incidunt eveniet provident fugit perferendis hic nemo sed consequatur, perspiciatis vel sit dolores minima.</p><br />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dusto. Libero pariatur, aspernatur, repudiandae repellendus excepturi nostrum at possimus eaque repellat  molestias magnam, ullam debitis nobis sint ipsum et quam expedita saepe nisi ducimus soluta i incidunt eveniet nemo sed consequatur, perspiciatis vel sit dolores minima.</p><br />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus corrupti molestias magnam, ullam debitis nobis sint ipsum et quam expedita saepe nisi ur, repudiandae repellendus excepturi nostrum at possimus eaque repellat incidunt eveniet provident fugit perferendis hic nemo sed consequatur, perspiciatis vel sit dolores minima.</p><br />
                <p>Lorem ipsum  incidunt eveniet provident fugit perferendis hic nemo sed consequatur, perspiciatis vel sit dolores minima.</p>
            </div>
        </div>
    </>
  )
}
