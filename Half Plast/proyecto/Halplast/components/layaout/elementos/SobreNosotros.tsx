/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Nosotros = () => {
  return (
    <section className="bg-white flex justify-center items-center py-12">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
        <div className="md:w-1/2 text-center md:text-left px-6">
          <h2 className="text-sm text-gray-600 uppercase">Sobre nosotros</h2>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 my-4">
            Helping businesses <span className="text-green-500">succeed</span> through the power of video.
          </h1>
          <p className="text-gray-600 mb-6">
            Video is the future of business in this digital-focused world. Vidyard uses video to change the way companies connect and communicate. We help organizations of all sizes humanize their communications and personalize their customer experiences.
          </p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-medium">
            Sign Up for Free
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 px-6">
          <img src="/sobreNosotros1.jpeg" alt="About Us" className="rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
