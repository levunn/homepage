import React from 'react';


import {
  Award,     // Awards & Grants用
} from 'lucide-react';

// Define nordColors as it's used in the component but not provided in the snippet.
// These are placeholder values. You should replace them with your actual Nord theme colors.
const nordColors = {
  polarNight1: '#2E3440',
  polarNight3: '#4C566A',
  frost2: '#81A1C1',
  frost1: '#88C0D0',
  snowStorm0: '#ECEFF4',
  snowStorm2: '#D8DEE9',
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

function AwardsPage() {
  // Define your awards data as an array of objects
  const awards = [
    {
      id: 1,
      title: 'GSA Travel Award, University of Nevada, Reno',
      date: '2025',
    },
    {
      id: 2,
      title: 'Graduate Assistantship, University of Nevada, Reno',
      date: 'Aug. 2024 - (Present)',
    },
    {
      id: 3,
      title: 'RA from Spring-GX, The University of Tokyo',
      date: '2024',
    },
    {
      id: 4,
      title: 'The UTokyo Hands-on Activity Program Travel Grant, The University of Tokyo',
      date: '2019',
    },
    {
      id: 5,
      title: 'The UTokyo Hands-on Activity Program Travel Grant, The University of Tokyo',
      date: '2018',
    },
  ];

  return (
    <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
        <SectionTitle
          icon={Award} // Example for Awards & Grants
          title="Awards & Grants"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
      {/* デフォルトのリストスタイルを無効にし、カスタムのドットを配置します */}
      <ul className="list-none space-y-6"> {/* list-noneでデフォルトのドットを無効にします */}
        {awards.map((award) => (
          <li key={award.id} className="flex items-start"> {/* flexとitems-startでドットとテキストを横並びに配置 */}
            {/* カスタムのドット */}
            <div
              className="w-3 h-3 rounded-full mr-3 mt-2 flex-shrink-0" // ドットのサイズ、丸み、右マージン、上マージン、縮小防止
              style={{ backgroundColor: nordColors.frost2 }} // ドットの色
            ></div>
            {/* 賞のタイトルと日付のコンテナ */}
            <div className="flex flex-col">
              {/* 賞のタイトル */}
              <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>
                {award.title}
              </h3>
              {/* 賞の日付 */}
              <p className="text-md mt-1" style={{ color: nordColors.snowStorm0 }}>
                {award.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AwardsPage;
