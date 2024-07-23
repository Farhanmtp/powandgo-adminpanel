'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/services/auth';
import AppImage from '@/components/Base/AppImage';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    isVerified: false,
    message: '',
  });

  const verificationHandler = async () => {
    try {
      const data = await verifyEmail(token || '');
      setUser({
        isVerified: true,
        message: 'User Successfully Verified',
      });
    } catch (error: any) {
      setUser({
        isVerified: false,
        message: error?.message || 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && email) {
      verificationHandler();
    }

    return () => {};
  }, []);

  if (!token || !email) {
    return (
      <div>
        <h1>Invalid URL!</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      {loading ? (
        'Loading'
      ) : (
        <div className="h-full flex items-center justify-center flex-col gap-4">
          <AppImage
            height={200}
            width={200}
            src="/site/logo.svg"
            alt="App Logo"
          />
          <div className="max-w-[800px]">
            {user.isVerified ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <h3 className="text-[20px] md:text-[34px] text-center">
                  Congratulations! Your Email Address is Verified.
                </h3>
                <p className="text-center">
                  Thank you for verifying your email with powandgo. Your email
                  address has been successfully confirmed, and your powandgo
                  account is now active. You can now log in to your powandgo
                  account and start enjoying all the features and benefits we
                  offer, whether you&apos;re a consumer looking for convenient
                  charging solutions or a provider wanting to share your
                  Electric Vehicle Charging (EVC) stations with others.
                </p>
              </div>
            ) : (
              <p className="md:text-[20px] text-center">
                We apologize, but it appears the verification link has expired
                or encountered an issue. Please try clicking on &quot;Resend
                Verification Link&quot; within the app to receive a new
                verification email. Thank you for choosing powandgo.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
