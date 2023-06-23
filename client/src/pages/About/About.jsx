import React, { useState, useEffect } from 'react';
import { ContactUsForm } from '../../components/index';

const About = () => {

  return (
    <div className="AboutContainer flex flex-col w-2/3 gap-10 mb-20 m-auto mt-28">
      <div className="AboutUs bg-gray-300 flex flex-col items-center p-4 rounded gap-10">
        <h1 className="AboutHeader font-semibold text-3xl text-[#45A29E]">About Us</h1>
        <p className="AboutContent text-[#222222]">
          We are a team of dedicated Air Force enlisted members who have come together to create a
          web application aimed at addressing a critical issue: the lack of a centralized and
          efficient system to track donations and costs associated with the Airman's Attic. Our
          goal is to provide a solution that ensures our service members have access to the
          necessary resources when they move to a new base, thereby directly impacting their
          productivity and morale.
        </p>
        <h1 className="AboutHeader font-semibold text-3xl text-[#45A29E]">Our Mission</h1>
        <p className="AboutContent text-[#222222]">
          Our mission is to improve the efficiency and effectiveness of the Airman's Attic by
          providing a user-friendly web application that simplifies the process of tracking
          donations and costs. We believe that by addressing this crucial issue, we can have a
          direct and positive impact on the lives of our fellow service members.
        </p>
        <h2 className="AboutHeader2 font-semibold text-3xl text-[#45A29E]">Key Objectives</h2>
        <ul className="text-[#222222] list-disc p-4">
          <li className="p-2">
            Centralized Donation Tracking: We strive to create a centralized platform that enables
            seamless tracking of donations, making it easier to manage and distribute resources
            efficiently.
          </li>
          <li className="p-2">
            Cost Management: Our application will provide robust features to track the costs
            associated with running the Airman's Attic, enabling better financial planning and
            reducing wastage.
          </li>
          <li className="p-2">
            Productivity and Morale Boost: By ensuring that service members have access to the
            necessary resources when they move, we aim to enhance their productivity and morale,
            contributing to their overall well-being.
          </li>
          <li className="p-2">
            Financial Efficiency: Improving the efficiency of the Airman's Attic operations will
            lead to reduced financial losses, ensuring optimal resource utilization and positively
            impacting the overall budget and sustainability efforts of the Air Force.
          </li>
          <li className="p-2">
            Positive Image and Trust: Our application not only addresses a critical issue but also
            showcases the organization's commitment to caring for its members and effectively
            managing resources. By demonstrating effective resource management, we aim to foster a
            sense of pride and trust among the members of the Air Force.
          </li>
        </ul>
        <h1 className="AboutHeader font-semibold text-3xl text-[#45A29E]">Our Team</h1>
        <p className="TeamContent text-[#222222]">
          Our application was created by a team of talented Air Force enlisted members. Alexander
          True, Stephen Johnston, Elijah Snyder, and Austin Heard, all with firsthand experience
          in the Air Force, collaborated to develop this web application using React.js. We are
          passionate about making a difference in the lives of our fellow service members and are
          dedicated to creating a reliable and user-friendly solution for the Airman's Attic.
          Join us in our mission to improve the efficiency of the Airman's Attic, enhance resource
          management, and positively impact the lives of our service members. Together, we can
          make a meaningful difference and ensure our fellow airmen have the support they need
          during their transitions.
        </p>
      </div>
      <div className="AboutContact w-50 flex flex-col items-center justify-center p-2 ">
        <ContactUsForm id='ContactUsForm'/>
      </div>
    </div>
  );
};

export default About;
