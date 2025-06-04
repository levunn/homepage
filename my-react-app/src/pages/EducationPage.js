// src/pages/EducationPage.js
import React from 'react';
import {
  GraduationCap // Educationリンク用に追加
} from 'lucide-react';

// ロゴ画像をインポートします (パスとファイル名は実際の構成に合わせてください)
import unrLogo from '../assets/logo/unr_logo.png'; // 例: ネバダ大学リノ校のロゴ
import utokyoLogo from '../assets/logo/utokyo_logo.png'; // 例: 東京大学のロゴ

const nordColors = {
  polarNight1: '#3B4252',
  polarNight3: '#4C566A', // Used for SVG stroke
  snowStorm0: '#D8DEE9',
  snowStorm1: '#E5E9F0',
  snowStorm2: '#ECEFF4',
  frost1: '#88C0D0',
  frost2: '#81A1C1',
};

// Helper component for section titles with icons
function SectionTitle({ icon: IconComponent, title, iconColor, titleColor }) {
  return (
    <div className="flex items-center">
      <IconComponent className="w-7 h-7 md:w-8 md:h-8 mr-3 flex-shrink-0" style={{ color: iconColor }} />
      <h2 className="text-3xl font-semibold" style={{ color: titleColor }}>
        {title}
      </h2>
    </div>
  );
}

// インポートしたローカルロゴを使用するように更新
const schoolLogos = {
  unr: unrLogo, // インポートしたネバダ大学リノ校のロゴ変数
  utokyo: utokyoLogo, // インポートした東京大学のロゴ変数
};

function EducationEntry({ logoSrc, altText, degree, institution, department, dates, details }) {
  return (
    <div className="flex items-start space-x-4 md:space-x-6">
      {/* School Logo */}
      <img
        src={logoSrc} // ここでインポートされたロゴが使われます
        alt={altText}
        className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-md flex-shrink-0 mt-1 border border-polarNight3"
        // ローカル画像なので onError は通常不要ですが、万が一のために残すことも可能です
        // onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/4C566A/FFFFFF?text=Logo+Error"; }}
      />
      {/* Education Details */}
      <div className="flex-grow">
        <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>{degree}, {institution}</h3>
        <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>{department}</p>
        <p className="text-md" style={{ color: nordColors.snowStorm0 }}>{dates}</p>
        {details && details.length > 0 && (
          <ul className="list-disc list-inside text-lg mt-2 space-y-1 pl-5" style={{ color: nordColors.snowStorm0 }}>
            {details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


function EducationPage() {
  const educationData = [
    {
      logoSrc: schoolLogos.unr,
      altText: "University of Nevada, Reno Logo",
      degree: "DEng",
      institution: "The University of Nevada, Reno",
      department: "Department of Computer Science and Engineering, Graduate School of Engineering",
      dates: "Aug. 2024 - Present",
      details: [
        "Advisor: Prof. George Bebis, Co-Advisors: Prof. Hamed Ebrahimian, Prof. Dani Or",
        "Focus: Wildfire monitoring, prediction using computer vision.",
        "Advisor: Prof. Ping Liu (Aug. 2024 - Apr. 2025)",
        "Focus: Efficient AI primarily focuses on optimizing datasets, such as through dataset distillation and pruning.",
        "GPA: 4.0/4.0",
        "Relevant Coursework: Advanced Computer Vision, Analysis of Algorithm, Operating System"
      ]
    },
    {
      logoSrc: schoolLogos.utokyo,
      altText: "The University of Tokyo Logo",
      degree: "MEng",
      institution: "The University of Tokyo",
      department: "Department of Aeronautics and Astronautics, Graduate School of Engineering",
      dates: "Apr. 2022 - Mar. 2024",
      details: [
        "Advisors: Prof. Akira Iwasaki, Prof. Takehisa Yairi",
        "GPA: 3.94/4.0",
        "Thesis Title: \"Ground Image Localization Using Aerial image\"",
        "Relevant Coursework: Computer Vision, Deep Learning, Artificial Intelligence, Remote Sensing, Computational Linguistics, Image Media Technologies, Written and Spoken Language Information Processing, Picture Processing"
      ]
    },
    {
      logoSrc: schoolLogos.utokyo, // BEngも同じ東京大学のロゴを使用
      altText: "The University of Tokyo Logo",
      degree: "BEng",
      institution: "The University of Tokyo",
      department: "Department of Aeronautics and Astronautics, School of Engineering",
      dates: "Apr. 2018 - Mar. 2022",
      details: [
        "Advisor: Prof. Akira Iwasaki",
        "GPA: 3.71/4.0 (Major GPA)",
        "Thesis Title: \"Misalignment Estimation of Satellite Images by Statistical Similarity\"",
        "Relevant Coursework: Mathematics (calculus, linear algebra, complex analysis, Fourier series etc.), Remote Sensing, Aerospace Information System, Numerical Computation, Design of Rocket Engine"
      ]
    }
  ];

  return (
    <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 font-sans">
      {/* Flex container for Section Title */}
      <div className="flex items-center mb-6">
        <SectionTitle
          icon={GraduationCap}
          title="Education"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
      </div>

      {/* Education Entries */}
      <div className="space-y-8 mt-6">
        {educationData.map((edu, index) => (
          <EducationEntry
            key={index}
            logoSrc={edu.logoSrc}
            altText={edu.altText}
            degree={edu.degree}
            institution={edu.institution}
            department={edu.department}
            dates={edu.dates}
            details={edu.details}
          />
        ))}
      </div>
    </section>
  );
}

export default EducationPage;
