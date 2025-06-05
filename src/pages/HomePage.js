// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate をインポート
import {
  User,
  FlaskConical,
  FileText,
  Shapes,
  Wrench,
  // Mail, Briefcase, Globe, FileDown, Award など、このページで直接使うアイコンがあればインポート
} from 'lucide-react';

// 画像をインポート
import profileImage from '../assets/profile/me.png'; // あなたの画像へのパス

// --- Publication Data --- (これは変更なし)
const publicationsData = {
  preprints: [
    {
      id: 'arxiv2025',
      authors: ['Yagi R.'],
      mainAuthor: 'Yagi R.',
      title: 'Extending Dataset Pruning to Object Detection: A Variance-based Approach',
      details: 'arXiv preprint arXiv:2505.17245.',
      year: '2025, May',
      links: [
        { name: 'arXiv', url: 'https://arxiv.org/abs/2505.17245' }
      ]
    }
  ],
  conferencePapers: [
    {
      id: 'neurips2024',
      authors: ['Baba, K.', 'Yagi R.', 'Takahashi J.', 'Kishikawa R.', 'Kodera S.'],
      mainAuthor: 'Yagi R.',
      title: 'JRadiEvo: A Japanese Radiology Report Generation Model Enhanced by Evolutionary Optimization of Model Merging',
      details: 'NeurIPS 2024 Workshop on AIM-FM: Advancements In Medical Foundation Models: Explainability, Robustness, Security, and Beyond. Vancouver, Canada (Poster Presentation).',
      year: '2024, November',
      links: [
        { name: 'arXiv', url: 'https://arxiv.org/abs/2411.09933' }
      ]
    },
    {
      id: 'acm2023',
      authors: ['Yagi, R.', 'Yairi, T.', 'Iwasaki, A.'],
      mainAuthor: 'Yagi, R.',
      title: 'Navigating the Metaverse: UAV-Based Cross-View Geo-Localization in Virtual Worlds',
      details: 'In Proceedings of the 2023 ACM Multimedia Workshop on UAVs in Multimedia: Capturing the World from a New Perspective (pp. 13-17). Ottawa, Canada (Poster Presentation).',
      year: '2023, November',
      links: [
        { name: 'PDF', url: 'https://drive.google.com/file/d/1GijV34yzRG1Bh5QJtqeJQTO6pbp7oLxq/view?usp=sharing' },
        { name: 'Poster', url: 'https://drive.google.com/file/d/1CzpjxPHG4je72JDMSv2g5-IQo6eu5UyU/view?usp=sharing' }
      ]
    },
    {
      id: 'igarss2023',
      authors: ['Yagi, R.', 'Iwasaki, A.'],
      mainAuthor: 'Yagi, R.',
      title: 'Lightweight CNN for Cross-View Geo-Localization Using Aerial Image',
      details: 'In IGARSS 2023-2023 IEEE International Geoscience and Remote Sensing Symposium (pp. 6266-6269). IEEE Pasadena, USA. (Poster Presentation).',
      year: '2023, July',
      links: [
        { name: 'PDF', url: 'https://drive.google.com/file/d/1GlqDKwmE3sEB8K5jt5iTXsQLX4R7Rgnm/view?usp=sharing' },
        { name: 'Poster', url: 'https://drive.google.com/file/d/1z8gtEG2gEV0I2wOaCx8wDCCWe6KQKsP3/view?usp=sharing' }
      ]
    }
  ],
  oralPresentations: [
    {
      id: 'isrs2022',
      authors: ['Yagi, R.', 'Iwasaki, A.'],
      mainAuthor: 'Yagi, R.',
      title: 'Fault Displacement Estimation from Satellite Imagery',
      details: 'In ISRS International Symposium on Remote Sensing. Online. (Oral Presentation).',
      year: '2022, May',
      links: [
        { name: 'PDF', url: 'https://drive.google.com/file/d/1mBeVT2yXlPOhVOeIrh_xInoib01DDjeB/view?usp=sharing' }
      ]
    }
  ]
};

// 著者をフォーマットするヘルパー関数（指定された名前を太字にする）
const FormatAuthors = ({ authors, mainAuthor }) => {
  return authors.map((author, index) => (
    <span key={index}>
      {author.includes(mainAuthor) ? <strong>{author}</strong> : author}
      {index < authors.length - 1 ? ', ' : ''}
    </span>
  ));
};

// HomePage コンポーネント
// props として setCurrentPage, SectionTitle, nordColors を受け取る
function HomePage({ setCurrentPage, SectionTitle, nordColors }) {
  const navigate = useNavigate(); // useNavigate フックを使用

  // ナビゲーションとヘッダーの現在のページ状態を更新する関数
  const handleNavigate = (path, pageName) => {
    navigate(path); // URL を変更してページ遷移
    if (setCurrentPage) {
      setCurrentPage(pageName); // ヘッダーの表示を更新
    }
  };

  // SectionTitle と nordColors が props として渡されていることを確認
  if (!SectionTitle || !nordColors) {
    // 開発中にわかりやすいようにエラーまたはフォールバックを表示
    console.error("SectionTitle or nordColors prop is missing in HomePage");
    return <div>Loading page content... (Required props missing)</div>;
  }

  return (
    <>
      {/* About Me Section */}
      <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
        <SectionTitle
          icon={User}
          title="About Me"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
        {/* プロフィール画像の追加 */}
        <div className="flex justify-center my-6"> {/* 画像を中央に配置し、上下にマージンを追加 */}
          <img
            src={profileImage}
            alt="R. Yagi" // 代替テキストは適切に設定してください
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-2 border-polarNight3" // サイズ、円形、カバー、影、ボーダー
          />
        </div>
        <p className="text-lg leading-relaxed" style={{ color: nordColors.snowStorm0 }}>
          I am a Ph.D. student in Computer Science and Engineering at the University of Nevada, Reno, maintaining a 4.0/4.0 GPA. My research centers on wildfire monitoring and prediction, leveraging physics-based deep learning and computer vision techniques.
          I hold both a Master’s and Bachelor’s degree in Aeronautics and Astronautics from the University of Tokyo, where I developed a strong foundation in remote sensing and data analysis.
          For more details on my academic journey, please visit the <span className="underline cursor-pointer" style={{ color: nordColors.auroraGreen }} onClick={() => handleNavigate('/education', 'education')}>Education</span> page, and for my professional experiences, check the <span className="underline cursor-pointer" style={{ color: nordColors.auroraGreen }} onClick={() => handleNavigate('/experience', 'experience')}>Experience</span> page.
        </p>
      </section>

       {/* Research Projects Section */}
      <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
        <SectionTitle
          icon={FlaskConical}
          title="Research Projects"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
        <ul className="list-disc list-inside text-lg space-y-3" style={{ color: nordColors.snowStorm0 }}>
          <li>
            <strong>Wildfire Prediction & Monitoring:</strong> <strong style={{ color: nordColors.auroraOrange }}> Active Project 🔥</strong>
            <div className="ml-8">
              Researching and developing advanced computer vision techniques for the early detection, tracking, and behavior prediction of wildfires. Utilizing satellite imagery, aerial data, and ground-based sensors to create robust and efficient monitoring systems. 
            </div>
          </li>
          <li>
            <strong>Dataset Pruning for Object Detection:</strong>
            <div className="ml-8">
              Extended Dataset Pruning techniques beyond image classification to object detection. Applied traditional pruning metrics to object detection and obtained preliminary results demonstrating their applicability. Identified strong correlations between pruned dataset's accuracy and factors such as class distribution difference and the number of annotations.
            </div>
          </li>
          <li>
            <strong>Dataset Distillation with Diffusion Model:</strong>
            <div className="ml-8">
              Explored Dataset Distillation using a generative approach with Stable Diffusion to approximate the data distribution using a small set of optimized synthetic images. Successfully represented class-wise prototypes by approximating the latent variables of the diffusion model with a Variational Autoencoder (VAE). Introduced a scaling parameter to control VAE latent variables, enhancing intra-class diversity in generated images. Found that the low accuracy of the teacher model used to generate soft labels supports the performance of the student model when distilled dataset size is small.
            </div>
          </li>
          <li>
            <strong>Radiology Report Generation Model (JRadiEvo):</strong>
            <div className="ml-8">
              Proposed JRadiEvo, a Japanese radiology report generation model adapting non-medical VLMs to the medical domain with only 50 samples. Achieved superior performance over CheXagent under few-shot settings. Designed a lightweight 800M-parameter model suitable for local deployment, ensuring privacy compliance.
            </div>
          </li>
          <li>
            <strong>Cross-View Geo-Localization:</strong>
            <div className="ml-8">
              Developed a lightweight CNN for localizing ground images using aerial views, and created a synthetic UAV dataset in a virtual environment to validate a novel loss function.
            </div>
          </li>
          <li>
            <strong>Hyperspectral HISUI Data Analysis Project:</strong>
            <div className="ml-8">
              Simulated CO2 properties using MODTRAN and surveyed methods for using hyperspectral data from HISUI for Canopy Nitrogen Contents (CNC).
            </div>
          </li>
          <li>
            <strong>Simulation of Visual Navigation for UAVs:</strong>
            <div className="ml-8">
              Researched simulation of visual navigation for UAVs using reinforcement learning, proposing rewards for better accuracy.
            </div>
          </li>
          <li>
            <strong>Satellite Image Analysis (R&D Engineer):</strong>
            <div className="ml-8">
              Implemented a random forest algorithm for land classification using Google Earth Engine, outperforming the standard method, Dynamic World.
            </div>
          </li>
        </ul>
      </section>


      {/* Publications Section */}
      <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
        <SectionTitle
          icon={FileText}
          title="Publications"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
        <p className="mt-4 text-lg" style={{ color: nordColors.snowStorm0 }}>
          For a complete list, please visit my <a href="https://scholar.google.com/citations?user=MygjhWsAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="underline hover:text-frost1 transition-colors duration-200" style={{ color: nordColors.auroraGreen }}>Google Scholar profile</a>.
        </p>

        {publicationsData.preprints && publicationsData.preprints.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: nordColors.snowStorm1 }}>Preprints</h3>
            <ul className="space-y-4">
              {publicationsData.preprints.map(pub => (
                <li key={pub.id} className="text-base md:text-lg" style={{ color: nordColors.snowStorm0 }}>
                  <FormatAuthors authors={pub.authors} mainAuthor={pub.mainAuthor} /> ({pub.year}). <em>{pub.title}</em>. {pub.details}
                  {pub.links && pub.links.length > 0 && (
                    <span className="ml-1">
                      {pub.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-frost1 transition-colors duration-200 mr-2 whitespace-nowrap" style={{ color: nordColors.auroraGreen }}>
                          [{link.name}]
                        </a>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {publicationsData.conferencePapers && publicationsData.conferencePapers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: nordColors.snowStorm1 }}>Conference & Workshop Papers</h3>
            <ul className="space-y-4">
              {publicationsData.conferencePapers.map(pub => (
                <li key={pub.id} className="text-base md:text-lg" style={{ color: nordColors.snowStorm0 }}>
                  <FormatAuthors authors={pub.authors} mainAuthor={pub.mainAuthor} /> ({pub.year}). <em>{pub.title}</em>. {pub.details}
                  {pub.links && pub.links.length > 0 && (
                    <span className="ml-1">
                      {pub.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-frost1 transition-colors duration-200 mr-2 whitespace-nowrap" style={{ color: nordColors.auroraGreen }}>
                          [{link.name}]
                        </a>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {publicationsData.oralPresentations && publicationsData.oralPresentations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: nordColors.snowStorm1 }}>Oral Presentations</h3>
            <ul className="space-y-4">
              {publicationsData.oralPresentations.map(pub => (
                <li key={pub.id} className="text-base md:text-lg" style={{ color: nordColors.snowStorm0 }}>
                  <FormatAuthors authors={pub.authors} mainAuthor={pub.mainAuthor} /> ({pub.year}). <em>{pub.title}</em>. {pub.details}
                  {pub.links && pub.links.length > 0 && (
                    <span className="ml-1">
                      {pub.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-frost1 transition-colors duration-200 mr-2 whitespace-nowrap" style={{ color: nordColors.auroraGreen }}>
                          [{link.name}]
                        </a>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Past Extracurricular Projects Section */}
      <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
        <SectionTitle
          icon={Shapes}
          title="Past Extracurricular Projects"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
            <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
              <a href="https://teamisshin.com/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: nordColors.frost1 }}>
                International Historic Car Rally Project
              </a>
            </h3>
            <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
              Managed PR and Logistics, secured over $20,000 in sponsorship, and developed the project website with nearly 50 articles on project status. Created a system to manage over 1,000 parts.
            </p>
          </div>
          <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
            <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
              <a href="http://www17408ui.sakura.ne.jp/tatsum/profile.html" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: nordColors.frost1 }}>
                Matsushita Lab Technical Staff
              </a>
            </h3>
            <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
              Worked on website updates and content editing, and developed software content for an online test for Japanese language acquisition.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
        <SectionTitle
          icon={Wrench}
          title="Skills"
          iconColor={nordColors.frost1}
          titleColor={nordColors.frost2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg" style={{ color: nordColors.snowStorm0 }}>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: nordColors.frost1 }}>Programming</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Python </li>
              <li>MATLAB </li>
              <li>C/C++ </li>
              <li>JavaScript </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: nordColors.frost1 }}>Libraries & Services</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Pytorch </li>
              <li>Pytorch Lightning </li>
              <li>Tensorflow </li>
              <li>Linux </li>
              <li>Docker </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: nordColors.frost1 }}>Professional Software</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>QGIS </li>
              <li>Google Earth Engine </li>
              <li>3DCAD </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
