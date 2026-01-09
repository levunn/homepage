// src/pages/GalleryPage.js
import React, { useEffect, useRef, useState } from 'react';

// 画像のインポート
import img2860 from '../assets/images/IMG_2860.jpg';
import img3006 from '../assets/images/IMG_3006_.jpg';
import img4517 from '../assets/images/IMG_4517.jpg';
import img4652 from '../assets/images/IMG_4652.jpg';
import img2626 from '../assets/images/IMG_2626.jpg';
import img4821 from '../assets/images/IMG_4821.jpg';
import img1000021689 from '../assets/images/1000021689.jpg';
import img5303 from '../assets/images/IMG_5303.jpg';
import img0480 from '../assets/images/IMG_0480.jpg';

// 新しく追加された画像
import img8072 from '../assets/images/IMG_8072.jpg';
import img8193 from '../assets/images/IMG_8193.jpg';
import img6705 from '../assets/images/IMG_6705.jpg';
import img7206 from '../assets/images/IMG_7206.jpg';
import img6218 from '../assets/images/IMG_6218.jpg';
import img8114 from '../assets/images/IMG_8114.jpg';
import img7387 from '../assets/images/IMG_7387.jpg';
import img7720 from '../assets/images/IMG_7720.jpg';
import img8101 from '../assets/images/IMG_8101.jpg';

import { Globe } from 'lucide-react';

const nordColors = {
  polarNight1: '#3B4252',
  polarNight2: '#434C5E',
  polarNight3: '#4C566A',
  snowStorm0: '#D8DEE9',
  snowStorm1: '#E5E9F0',
  snowStorm2: '#ECEFF4',
  frost1: '#88C0D0',
  frost2: '#81A1C1',
};

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

// 時系列（新しい順）のデータ
const earthPanoramas = [
  // --- 2025 May ---
  {
    id: 1,
    src: img7387,
    alt: 'Yosemite Valley from Glacier Point',
    location: 'Glacier Point, Yosemite National Park, California, USA',
    time: 'May, 2025',
    description: 'A grand panorama overlooking Yosemite Valley, featuring the iconic Half Dome and the vast Sierra Nevada wilderness.'
  },
  {
    id: 2,
    src: img6705,
    alt: 'Lake Tahoe Sunset',
    location: 'Sand Harbor, Lake Tahoe, Nevada, USA',
    time: 'May, 2025',
    description: 'Golden hour reflections over the crystal-clear waters of Lake Tahoe, framed by ancient granite boulders.'
  },
  {
    id: 3,
    src: img4821,
    alt: 'Lake Louise, Banff',
    location: 'Lake Louise, Banff National Park, Alberta, Canada',
    time: 'May, 2025',
    description: 'The famous turquoise waters of Lake Louise, surrounded by the majestic Victoria Glacier and pine forests.'
  },
  {
    id: 4,
    src: img4652,
    alt: 'Bow Lake, Banff',
    location: 'Bow Lake, Banff National Park, Alberta, Canada',
    time: 'May, 2025',
    description: 'A serene view of the partially frozen Bow Lake, nestled amidst the rugged peaks of the Canadian Rockies.'
  },
  {
    id: 5,
    src: img4517,
    alt: 'Lake Tahoe, Monkey Rock',
    location: 'Monkey Rock Trail, Lake Tahoe, Nevada, USA',
    time: 'May, 2025',
    description: 'A sweeping panorama of North Lake Tahoe’s deep blue waters from a high-altitude rocky viewpoint.'
  },
  {
    id: 6,
    src: img7206,
    alt: 'San Francisco Skyline',
    location: 'San Francisco Bay, California, USA',
    time: 'May, 2025',
    description: 'The urban heart of San Francisco as seen from across the bay, blending skyscrapers with coastal greenery.'
  },
  {
    id: 7,
    src: img7720,
    alt: 'Craters of the Moon',
    location: 'Craters of the Moon National Monument, Idaho, USA',
    time: 'May, 2025',
    description: 'A surreal and stark volcanic landscape featuring massive cinder fields and dormant cones under a sharp blue sky.'
  },
  {
    id: 8,
    src: img3006,
    alt: 'Antelope Canyon',
    location: 'Antelope Canyon, Arizona, USA',
    time: 'May, 2025',
    description: 'The mesmerizing flow of sunlight and shadow through the wave-like walls of this famous slot canyon.'
  },
  // --- 2025 January ---
  {
    id: 9,
    src: img6218,
    alt: 'Sierra Nevada Winter Inversion',
    location: 'Mount Rose Summit, Nevada, USA',
    time: 'January, 2025',
    description: 'A spectacular weather inversion layering the valley in thick clouds, leaving the snowy peaks bathed in bright sunlight.'
  },
  // --- 2024 November ---
  {
    id: 10,
    src: img8072,
    alt: 'Delicate Arch, Arches National Park',
    location: 'Delicate Arch, Arches National Park, Utah, USA',
    time: 'November, 2024',
    description: 'The iconic natural sandstone arch standing majestically against a backdrop of deep canyons and distant peaks.'
  },
  {
    id: 11,
    src: img8114,
    alt: 'Monument Valley Sunrise',
    location: 'Monument Valley Navajo Tribal Park, Arizona/Utah, USA',
    time: 'November, 2024',
    description: 'Breathtaking light at dawn over the Mittens and Merrick Butte, casting long shadows across the red desert.'
  },
  {
    id: 12,
    src: img8101,
    alt: 'Canyonlands National Park',
    location: 'Grand View Point, Canyonlands National Park, Utah, USA',
    time: 'November, 2024',
    description: 'An expansive view from the Island in the Sky mesa, showing the intricate "cracks" carved by the Colorado River.'
  },
  {
    id: 13,
    src: img8193,
    alt: 'White Sands National Park',
    location: 'White Sands National Park, New Mexico, USA',
    time: 'November, 2024',
    description: 'The minimalist beauty of undulating white gypsum dunes under a vast, cloudless sky.'
  },
  {
    id: 14,
    src: img2860,
    alt: 'Bryce Canyon Winter',
    location: 'Bryce Canyon National Park, Utah, USA',
    time: 'November, 2024',
    description: 'A stunning winter panorama where snow dusts the ancient orange hoodoos, creating a vibrant color contrast.'
  },
  {
    id: 15,
    src: img2626,
    alt: 'Nevada Desert Landscape',
    location: 'Red Rock Canyon, Nevada, USA',
    time: 'November, 2024',
    description: 'The rugged mountains and sparse desert flora of Southern Nevada, characteristic of the Mojave Desert.'
  },
  // --- 2024 July ---
  {
    id: 16,
    src: img1000021689,
    alt: 'Mount Fuji Crater',
    location: 'Mount Fuji, Kengamine Peak, Japan',
    time: 'July, 2024',
    description: 'A rare panoramic view from the highest point of Japan, looking into the massive volcanic crater.'
  },
  // --- 2024 June ---
  {
    id: 17,
    src: img5303,
    alt: 'Chicago Skyline',
    location: 'Lakefront Trail, Chicago, Illinois, USA',
    time: 'June, 2024',
    description: 'A panoramic urban view of Chicago seen across the vibrant blue waters of Lake Michigan.'
  },
  {
    id: 18,
    src: img0480,
    alt: 'Mount Batur and Lake Batur, Bali',
    location: 'Kintamani, Bali, Indonesia',
    time: 'June, 2024',
    description: 'The volcanic Mount Batur and its serene caldera lake, captured from a viewpoint in the highlands of Bali.'
  }
];

function GalleryPage() {
  return (
    <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
      <SectionTitle
        icon={Globe}
        title="Earth Panorama Gallery"
        iconColor={nordColors.frost1}
        titleColor={nordColors.frost2}
      />
      <p className="text-lg leading-relaxed mb-6" style={{ color: nordColors.snowStorm0 }}>
        A collection of panoramic views capturing diverse landscapes across the globe, from the peaks of Japan to the deserts of the American West.
      </p>
      <p className="text-sm text-frost1 block md:hidden mb-6">
        * You can scroll horizontally to view the full panorama on mobile.
      </p>
      <div className="grid grid-cols-1 gap-8">
        {earthPanoramas.map(panorama => (
          <PanoramaCard key={panorama.id} panorama={panorama} />
        ))}
      </div>
    </section>
  );
}

function PanoramaCard({ panorama }) {
  const scrollRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (scrollRef.current && imageLoaded) {
      const imageElement = scrollRef.current.querySelector('img');
      if (imageElement) {
        const imageWidth = imageElement.scrollWidth;
        const containerWidth = scrollRef.current.clientWidth;

        if (imageWidth > containerWidth) {
          scrollRef.current.scrollLeft = (imageWidth - containerWidth) / 2;
        } else {
          scrollRef.current.style.justifyContent = 'center';
          scrollRef.current.style.display = 'flex';
        }
      }
    }
  }, [imageLoaded, panorama.src]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost1 transition-all duration-200">
      <div
        ref={scrollRef}
        className="overflow-x-auto whitespace-nowrap lg:overflow-x-hidden lg:whitespace-normal scrollbar-hide"
      >
        <img
          src={panorama.src}
          alt={panorama.alt}
          className="h-64 inline-block rounded-md mb-4 object-cover"
          style={{ width: 'auto', maxWidth: 'none' }}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
        <h3 className="text-xl font-semibold" style={{ color: nordColors.snowStorm2 }}>
          {panorama.location}
        </h3>
        <span className="text-sm font-medium px-2 py-1 rounded bg-polarNight3" style={{ color: nordColors.frost1 }}>
          {panorama.time}
        </span>
      </div>
      <p className="text-base mt-2" style={{ color: nordColors.snowStorm0 }}>
        {panorama.description}
      </p>
    </div>
  );
}

export default GalleryPage;