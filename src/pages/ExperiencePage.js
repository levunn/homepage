// src/pages/ExperiencePage.js
import React from 'react';
import {
  Briefcase, // Experience用
} from 'lucide-react';

const nordColors = {
  polarNight1: '#3B4252',
  polarNight3: '#4C566A',
  snowStorm0: '#D8DEE9',
  snowStorm1: '#E5E9F0',
  snowStorm2: '#ECEFF4',
  frost1: '#88C0D0',
  frost2: '#81A1C1',
  auroraOrange: '#D08770', // auroraOrange を追加
};


// Helper component for section titles with icons
function SectionTitle({ icon: IconComponent, title, iconColor, titleColor }) {
  return (
    <div className="flex items-center mb-4">
      <IconComponent className="w-7 h-7 md:w-8 md:h-8 mr-3 flex-shrink-0" style={{ color: iconColor }} />
      <h2 className="text-3xl font-semibold" style={{ color: titleColor }}>
        {title}
      </h2>
    </div>
  );
}

// Define experience data
const experiences = [
  {
    id: 1,
    company: 'HELIOS (Online)',
    role: 'AI Advisor',
    period: 'Oct. 2024 - Present',
    details: [
      'Offering AI and Remote Sensing expertise and skills to engineers on a voluntary basis.',
    ],
  },
  {
    id: 2,
    company: 'Kodera Lab, The University of Tokyo (Tokyo, Japan)',
    role: 'AI Engineer',
    period: 'Feb. 2024 - Aug. 2024',
    details: [
      'Engaging in the development of a large language model (LLM) for medical applications.',
    ],
  },
  {
    id: 3,
    company: 'Washington University in St. Louis (Missouri, USA)',
    role: 'Full-Time Research Internship, under Prof. Nathan Jacobs',
    period: 'Sep. 2023 - Oct. 2023',
    details: [
      'Researched on simulation of visual navigation for UAVs using reinforcement learning.',
      'Proposed rewards which achieved better accuracy than baseline.',
    ],
  },
  {
    id: 4,
    company: 'MITSUI & CO., LTD. (Tokyo, Japan)',
    role: 'Part-time R&D engineer for satellite image analysis',
    period: 'Jan. 2023 - Sep. 2023',
    details: [
      'Implemented a random forest algorithm for land classification using Google Earth Engine.',
      'The algorithm exhibited superior performance in land cover / classification, outperforming the standard method, Dynamic World.',
    ],
  },
  {
    id: 5,
    company: 'NEC Visual Intelligence Research Laboratories (Kanagawa, Japan)',
    role: 'Full-Time Summer Research Internship, under Mr. Royston Rodrigues',
    period: 'Aug. 2022 - Oct. 2022',
    details: [
      'Proposed a two-streamed GAN to bridge the gap between aerial and street images.',
      'Achieved better accuracy than single-towered GAN (baseline).',
      'Communicated and participated in research discussions, final presentations, and daily interactions fully in English.',
    ],
  },
];

function ExperiencePage() {
  return (
    <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
      <SectionTitle
        icon={Briefcase}
        title="Work Experience"
        iconColor={nordColors.frost1} // Corrected to use auroraOrange
        titleColor={nordColors.frost2}
      />
      <ul className="list-none space-y-6"> {/* list-none to remove default bullets, space-y for vertical spacing */}
        {experiences.map((exp) => (
          <li key={exp.id} className="flex items-start"> {/* Align custom dot and content */}
            {/* Custom dot */}
            <div
              className="w-3 h-3 rounded-full mr-4 mt-2 flex-shrink-0" // Adjusted margin for better alignment
              style={{ backgroundColor: nordColors.frost2 }} // Dot color
            ></div>
            {/* Experience details container */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>
                {exp.company}
              </h3>
              <p className="text-lg mt-0.5" style={{ color: nordColors.snowStorm1 }}> {/* Adjusted margin */}
                {exp.role}
              </p>
              <p className="text-md mt-1" style={{ color: nordColors.snowStorm0 }}>
                {exp.period}
              </p>
              <ul className="list-disc list-inside text-base mt-2 space-y-1 pl-1" style={{ color: nordColors.snowStorm0 }}>
                {exp.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ExperiencePage;