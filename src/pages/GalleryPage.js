// src/pages/GalleryPage.js
import React, { useEffect, useRef, useState } from 'react'; // useStateをインポートに追加

// 画像のインポート
// 画像のパスは、実際に画像を配置した場所に合わせて調整してください。
import img2860 from '../assets/images/IMG_2860.jpg';
import img3006 from '../assets/images/IMG_3006_.jpg';
import img4517 from '../assets/images/IMG_4517.jpg';
import img4652 from '../assets/images/IMG_4652.jpg';
// import img2625 from '../assets/images/IMG_2625.jpg';
import img2626 from '../assets/images/IMG_2626.jpg';
import img4821 from '../assets/images/IMG_4821.jpg';
import img1000021689 from '../assets/images/1000021689.jpg';
import {
  Globe // Globeアイコンをインポート
} from 'lucide-react';


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
// Helper component for section titles with icons (ExperiencePage.jsからコピー)
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
// Earth panorama images
const earthPanoramas = [
  {
    id: 8,
    src: img4821,
    alt: 'Lake Louise, Banff National Park',
    location: 'Lake Louise, Banff National Park, Alberta, Canada',
    time: 'May, 2025', // 推測される時期
    description: 'A panoramic view of the turquoise Lake Louise, surrounded by snow-capped peaks, glaciers, and dense pine forests in Banff National Park.'
  },
  {
    id: 2,
    src: img4652,
    alt: 'Bow Lake, Banff National Park',
    location: 'Bow Lake, Banff National Park, Alberta, Canada',
    time: 'May, 2025', // 推測される時期
    description: 'A panoramic view of the partially frozen Bow Lake, nestled amidst snow-capped mountains in Banff National Park.'
  },
  {
    id: 3,
    src: img4517,
    alt: 'Lake Tahoe, Monkey Rock',
    location: 'Monkey Rock, Lake Tahoe, California',
    time: 'May, 2025', // 推測される時期
    description: 'A breathtaking panorama of the clear blue waters of Lake Tahoe from the Monkey Rock Trailhead.'
  },
  {
    id: 4,
    src: img2860,
    alt: 'Bryce Canyon National Park',
    location: 'Bryce Canyon National Park, Utah, USA',
    time: 'November, 2024', // 推測される時期
    description: 'A stunning winter panorama of Bryce Canyon, featuring snow-dusted hoodoos under a clear blue sky.'
  },  
  {
    id: 1,
    src: img3006,
    alt: 'Antelope Canyon',
    location: 'Antelope Canyon, Arizona, USA',
    time: 'May, 2025', // 推測される時期
    description: 'The iconic slot canyon with its mesmerizing, wave-like rock formations and beams of light.'
  },
  {
    id: 5,
    src: img2626,
    alt: 'Nevada Desert Panorama',
    location: 'Red Rock Canyon Area, Nevada, USA',
    time: 'November, 2024', // 推測される時期
    description: 'A wide view of the Nevada desert landscape, characterized by rugged mountains and sparse vegetation under a bright sun.'
  },
//   {
//     id: 6,
//     src: img2625,
//     alt: 'Red Rock Canyon National Conservation Area',
//     location: 'Red Rock Canyon National Conservation Area, Nevada, USA',
//     time: 'Spring/Autumn', // 推測される時期
//     description: 'An expansive panorama of the Red Rock Canyon with its distinctive red sandstone formations and desert flora.'
//   },
  {
    id: 7,
    src: img1000021689,
    alt: 'Mount Fuji Crater',
    location: 'Mount Fuji, Kengamine Peak, Japan',
    time: 'July, 2024', // 推測される時期 (登山シーズン)
    description: 'A panoramic view of the crater rim of Mount Fuji, Japan\'s iconic highest peak.'
  },
];

function GalleryPage() {
  return (
    <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
      <SectionTitle
        icon={Globe}
        title="Earth Panorama Gallery"
        iconColor={nordColors.frost1} // アイコンの色を指定
        titleColor={nordColors.frost2}
      />
      <p className="text-lg leading-relaxed mb-6" style={{ color: nordColors.snowStorm0 }}>
        Explore beautiful panoramas of Earth, showcasing diverse landscapes and atmospheric phenomena captured from space.
      </p>
      <p className="text-sm text-frost1 block md:hidden mb-6">
        * You can scroll horizontally to view the full panorama on mobile.
      </p>
      <div className="grid grid-cols-1 gap-8">
        {earthPanoramas.map(panorama => (
          <PanoramaCard key={panorama.id} panorama={panorama} /> // PanoramaCardコンポーネントを使用
        ))}
      </div>
    </section>
  );
}


// 新しいPanoramaCardコンポーネントを定義
function PanoramaCard({ panorama }) {
  const scrollRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false); // 画像のロード状態を管理するstateを追加

  useEffect(() => {
    // コンポーネントがマウントされたとき、および依存配列が変更されたときに実行
    // imageLoadedがtrueになってから処理を実行することで、画像が完全にロードされたことを保証
    if (scrollRef.current && imageLoaded) {
      const imageElement = scrollRef.current.querySelector('img'); // img要素を取得
      if (imageElement) {
        // 画像の実際の幅とコンテナの表示幅に基づいて中央にスクロール
        const imageWidth = imageElement.scrollWidth; // img要素の幅を取得
        const containerWidth = scrollRef.current.clientWidth; // コンテナの表示幅を取得

        // 画像がコンテナより大きい場合にのみスクロールを適用
        if (imageWidth > containerWidth) {
          scrollRef.current.scrollLeft = (imageWidth - containerWidth) / 2;
        } else {
          // 画像がコンテナに収まる場合は、Flexboxで中央寄せする
          scrollRef.current.style.justifyContent = 'center';
          scrollRef.current.style.display = 'flex';
        }
      }
    }
  }, [imageLoaded, panorama.src]); // imageLoadedとpanorama.srcが変更されたときに再実行

  // 画像がロードされたときに呼び出されるハンドラー
  const handleImageLoad = () => {
    setImageLoaded(true); // 画像のロードが完了したことをマーク
  };

  return (
    <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
      <div
        ref={scrollRef}
        className="overflow-x-auto whitespace-nowrap lg:overflow-x-hidden lg:whitespace-normal scrollbar-hide"
      >
        <img
          src={panorama.src}
          alt={panorama.alt}
          className="h-64 inline-block rounded-md mb-4 object-cover"
          style={{ width: 'auto', maxWidth: 'none' }}
          onLoad={handleImageLoad} // 画像ロード時にhandleImageLoadを実行
        />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
        {panorama.location}
      </h3>
      <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
        Time: {panorama.time}
      </p>
      <p className="text-base mt-2" style={{ color: nordColors.snowStorm0 }}>
        {panorama.description}
      </p>
    </div>
  );
}

export default GalleryPage;