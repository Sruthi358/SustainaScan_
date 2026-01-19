import React from 'react'
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <>
    <div className="min-h-screen bg-white flex items-start justify-center px-4 py-4 pt-10">
        <div className="grid sm:grid-cols-2 items-start gap-12 p-8 max-w-4xl w-full rounded-2xl shadow-xl border border-gray-300">
            {/* Left Section */}
            <div>
                <h1 className="text-gray-900 text-3xl font-bold">Let's Talk</h1>
                <p className="text-gray-700 text-sm mt-4 leading-relaxed">
                    Have some big idea or brand to develop and need help? Then reach out — we'd love to hear about your project and provide help.
                </p>
                <div className="mt-10">
                    <h2 className="text-gray-900 font-medium text-base">Email</h2>
                    <ul className="mt-3">
                        <li className="flex items-center space-x-4">
                            <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
                            {/* Email Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10b981" viewBox="0 0 479.058 479.058">
                                    <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"/>
                                </svg>
                            </div>
                            <div>
                            <small className="block text-gray-900 text-sm font-medium">Mail</small>
                            <span className="text-emerald-600 font-medium text-sm">sustaina123@gmail.com</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="mt-10">
                    <h2 className="text-gray-900 font-medium text-base">Socials</h2>
                    <ul className="flex mt-4 space-x-4">
                        {[FaFacebookF, FaLinkedinIn, FaInstagram].map((Icon, idx) => (
                            <li key={idx} className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                                <Link to="#"><Icon className="text-emerald-600 w-5 h-5" /></Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* Right Section - Form */}
            <form className="space-y-5 w-full">
                <input type="text" placeholder="Name" className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-emerald-600"/>
                <input type="email" placeholder="Email" className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-emerald-600"/>
                <input type="text" placeholder="Subject" className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-emerald-600"/>
                <textarea placeholder="Message" rows="4" className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-emerald-600"></textarea>
                <button type="submit" className="w-full bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold py-2.5 rounded-md shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Send</button>
            </form>
        </div>
    </div>
  </>
  )
}
