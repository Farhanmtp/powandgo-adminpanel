'use client';

import React, { FC, ReactNode } from 'react';
import AppButton from '@/components/Base/AppButton';
import { signOut } from 'next-auth/react';

interface AppPageHeaderProps {
  children: ReactNode;
}

// function useGoogleTranslateScript() {
//   useEffect(() => {
//     const scriptId = 'google-translate-script';
//     if (!document.getElementById(scriptId)) {
//       setTimeout(() => {
//         const addScript = document.createElement('script');
//         addScript.id = scriptId;
//         addScript.async = true;
//         addScript.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;

//         document.body.appendChild(addScript);
//         // debugger

//         // @ts-ignore:next-line
//         window.googleTranslateElementInit = () => {
//           // @ts-ignore:next-line
//           new window.google.translate.TranslateElement(
//             {
//               pageLanguage: 'en',
//               includedLanguages: 'en,it',
//               autoDisplay: true,
//             },
//             'google_translate_element'
//           );
//         };
//       }, 500);
//     }
//   }, []);
// }

const AppPageHeader: FC<AppPageHeaderProps> = ({ children }) => {
  const signoutHandler = () => {
    signOut();
  };

  // useGoogleTranslateScript();

  console.log('called again!!');

  return (
    <div className="flex flex-row flex-wrap justify-between items-start gap-8">
      {children}
      <div className="flex flex-row flex-wrap gap-4 items-start">
        {/* <div id="google_translate_element"></div> */}
        <AppButton
          className="h-[40px] min-w-[120px] !px-2 flex items-center justify-center hover:opacity-70 text-white"
          tertiary
          onClick={signoutHandler}
        >
          <p className="text-sm md:text-base font-normal leading-[150%] tracking-[-0.16px]">
            Sign Out
          </p>
        </AppButton>
      </div>
    </div>
  );
};

export default AppPageHeader;
