// import { useEffect, useState } from 'react';
// // import { SelectPicker } from 'rsuite';
// import { getCookie, hasCookie, setCookie } from 'cookies-next';
// import AppSelect from '../Base/AppSelect';

// const languages = [
//   { name: 'English', label: 'English', value: '/auto/en', id: `/auto/en` },
//   { name: 'Русский', label: `Русский`, value: '/auto/ru', id: `/auto/ru` },
//   { name: 'Polski', label: 'Polski', value: '/auto/pl', id: `/auto/pl` },
// ];

// const GoogleTranslate = () => {
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     console.log('google translate not loaded');
//     const addScript = document.createElement('script');
//     addScript.src =
//       '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//     document.body.appendChild(addScript);
//     window.googleTranslateElementInit = googleTranslateElementInit;
//   }, [selected]);

//   useEffect(() => {
//     if (hasCookie('googtrans')) {
//       setSelected(getCookie('googtrans'));
//     } else {
//       setSelected('/auto/en');
//     }
//   }, []);

//   const googleTranslateElementInit = () => {
//     new window.google.translate.TranslateElement(
//       {
//         pageLanguage: 'auto',
//         autoDisplay: false,
//         includedLanguages: 'ru,en,pl', // If you remove it, by default all google supported language will be included
//         layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
//       },
//       'google_translate_element'
//     );
//   };

//   const langChange = (e) => {
//     const langValue = e.value;
//     if (hasCookie('googtrans')) {
//       setCookie('googtrans', decodeURI(langValue));
//     } else {
//       setCookie('googtrans', langValue);
//     }
//     setSelected(langValue);
//   };

//   return (
//     <>
//       <div
//         id="google_translate_element"
//         style={{
//           width: '0px',
//           height: '0px',
//           position: 'absolute',
//           left: '50%',
//           zIndex: -99999,
//           display: 'none',
//         }}
//       ></div>

//       <AppSelect
//         options={languages}
//         selected={selected || null}
//         selectHandler={(value) => {
//           langChange(value);
//         }}
//         multiple={false}
//         title="Select Language"
//         error={''}
//         className="w-[270px] sm:w-[300px]"
//       />
//     </>
//   );
// };

// export default GoogleTranslate;
