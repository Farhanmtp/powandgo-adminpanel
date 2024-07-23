import './globals.css';
import '../styles/forms.css';
import '../styles/modal.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import AuthProvider from '@/context/AuthProvider';
import { ReduxProvider } from '@/redux/ReduxProvider';
import BackdropLoader from '@/components/Common/BackdropLoader';
import AppNotification from '@/components/Notifications/AppNotification';
import Script from 'next/script';

const apercu = localFont({
  src: [
    {
      path: '../../public/fonts/apercu_regular_pro.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/apercu_regular_italic_pro.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/apercu_medium_pro.otf',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../../public/fonts/apercu_medium_italic_pro.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/apercu_bold_pro.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/apercu_bold_italic_pro.otf',
      weight: '600',
      style: 'italic',
    },
  ],
});

export const metadata: Metadata = {
  title: 'powandgo',
  description: 'Launching Soon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/site/icon.svg" sizes="any" />
      </head>
      <body className={apercu.className}>
        <AuthProvider>
          <ReduxProvider>
            <div className="content">{children}</div>
            <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></Script>

            {/* <Script id="1">
              {`
    function googleTranslateElementInit() {
      new google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,it',
        layout: google.translate.TranslateElement.InlineLayout.VERTICAL
      },
        'google_translate_element'
      );
    }
`}
            </Script> */}
            <BackdropLoader />
            <AppNotification />
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
