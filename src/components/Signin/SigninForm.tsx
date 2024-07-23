'use client';
import { useState } from 'react';
import AppButton from '@/components/Base/AppButton';
import AppImage from '../Base/AppImage';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { useAppDispatch } from '@/redux/hooks';
import Link from 'next/link';
import * as CryptoJS from 'crypto-js';
import { passwordRegex } from '@/constants/AppConstants';

const SignInForm: React.FC = () => {
  let cryptoSecret = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

  const dispatch = useAppDispatch();

  let initialErrors = {
    email: '',
    password: '',
    general: '',
  };

  let initialEmail = '',
    initialPassword = '';

  let encryptedEmailLocal = localStorage.getItem('email'),
    encryptedPassLocal = localStorage.getItem('emailP');

  if (encryptedEmailLocal && encryptedPassLocal && cryptoSecret) {
    const passwordBytes = CryptoJS.AES.decrypt(
      encryptedPassLocal,
      cryptoSecret
    );
    initialPassword = passwordBytes.toString(CryptoJS.enc.Utf8);
    const emailBytes = CryptoJS.AES.decrypt(encryptedEmailLocal, cryptoSecret);
    initialEmail = emailBytes.toString(CryptoJS.enc.Utf8);
  }

  let initialRememberMe =
    encryptedEmailLocal && encryptedPassLocal ? true : false;

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [passwordShow, setPasswordShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(initialRememberMe);

  const [errorMessage, setErrorMessage] = useState(initialErrors);

  const router = useRouter();

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmailCheck(email) || !isValidPasswordCheck(password)) {
      if (!isValidEmailCheck(email)) {
        setErrorMessage((cur) => {
          return {
            ...cur,
            email: 'Invalid email format',
          };
        });
      }

      if (!isValidPasswordCheck(password)) {
        setErrorMessage((cur) => {
          return {
            ...cur,
            password:
              'Password must be a combination of uppercase letters, lowercase letters, numbers, and special characters (e.g., !, @, #, $, %)',
          };
        });
      }
      return;
    }
    dispatch(startLoading());
    let res: any = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        if (cryptoSecret && rememberMe) {
          const encryptPassword = CryptoJS.AES.encrypt(
            password,
            cryptoSecret
          ).toString();
          const encryptEmail = CryptoJS.AES.encrypt(
            email,
            cryptoSecret
          ).toString();
          localStorage.setItem('emailP', encryptPassword);
          localStorage.setItem('email', encryptEmail);
        }
        if (!rememberMe) {
          localStorage.removeItem('emailP');
          localStorage.removeItem('email');
        }
        return res;
      })
      .finally(() => dispatch(stopLoading()));

    if (res?.error) {
      setErrorMessage((cur) => {
        return {
          ...cur,
          general: String(res?.error),
        };
      });
    } else if (!res?.error) {
      router.push('/dashboard');
    }
  };

  // Show Hide Password
  const showPasswordHandler = () => {
    setPasswordShow((cur) => !cur);
  };

  // Check if Email is Valid
  const isValidEmailCheck = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if Password is Valid
  const isValidPasswordCheck = (password: string) => {
    return passwordRegex.test(password);
  };

  const emailHandler = (email: string) => {
    setErrorMessage((cur) => {
      return {
        ...cur,
        email: '',
      };
    });
    setEmail(email);
  };

  const passwordHandler = (password: string) => {
    setErrorMessage((cur) => {
      return {
        ...cur,
        password: '',
      };
    });
    setPassword(password);
  };

  let isDisabled =
    !email || !password || !(password.length >= 8) || !isValidEmailCheck(email);

  return (
    <div className="rounded-[22px] overflow-hidden flex flex-col items-center justify-center h-[515px] mx-[10px] px-[15px] sm:w-[600px] md:w-[720px] max-w-full sm:mx-auto backdrop-blur-[20px] bg-gradient-to-b from-[#1B204A70] to-[#3C42701F]">
      <h3 className="text-2xl font-semibold leading-6"> Sign in</h3>
      <form className="mx-auto sm:w-[334px] w-[270px] max-w-full pb-[30px]">
        <div className="flex flex-col">
          <div className="flex flex-col pl-[5px] pr-0 py-2.5  max-w-full h-[55px] border-b-[rgba(255,255,255,0.60)] border-b border-solid">
            <label
              htmlFor="email"
              className="text-secondary text-xs not-italic font-normal leading-[18px]"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => emailHandler(e.target.value)}
              className="bg-transparent outline-none"
              autoFocus
            />
            {errorMessage.email && (
              <p className="text-red-500 text-sm mt-2">{errorMessage.email}</p>
            )}
          </div>
          <div className="relative flex flex-col pl-[5px] pr-0 py-2.5  max-w-full min-h-[55px] mt-[21px] border-b-[rgba(255,255,255,0.60)] border-b border-solid">
            <label
              htmlFor="password"
              className="text-secondary text-xs not-italic font-normal leading-[18px]"
            >
              Password *
            </label>
            <input
              type={passwordShow ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => passwordHandler(e.target.value)}
              className="bg-transparent outline-none"
            />
            <div
              className="absolute right-[7px] bottom-[7px] cursor-pointer"
              onClick={showPasswordHandler}
            >
              <AppImage
                src={passwordShow ? '/eye-close.svg' : '/eye-open.svg'}
                alt="password-show-hide"
                width={24}
                height={24}
              />
            </div>
          </div>
          {errorMessage.password && (
            <div>
              <p className="text-red-500 text-sm mt-2">
                {errorMessage.password}
              </p>
            </div>
          )}

          <div className="flex flex-row pt-2.5 items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              value="rememberMe"
              checked={rememberMe}
              onChange={(event) => {
                setRememberMe(event.target.checked);
              }}
            />
            <label htmlFor="rememberMe" className="text-secondary">
              Remember Me
            </label>
          </div>
          {errorMessage.general && (
            <p className="text-red-500 text-sm mt-2">{errorMessage.general}</p>
          )}

          <Link
            className="text-right mt-[12px] cursor-pointer underline underline-offset-2"
            href="/forgot-password"
          >
            Forgot Password
          </Link>
        </div>

        <AppButton
          className="w-full h-[56px] mt-[30px] mx-auto"
          primary={!isDisabled}
          onClick={handleSubmit}
          disabled={isDisabled}
          type="submit"
        >
          <p className="font-semibold">Sign In</p>
        </AppButton>
      </form>
      {/* <AppButton
        onClick={() => {}}
        className="bg-white h-[48px]  sm:w-[340px] w-[270px] text-[#070C27] flex flex-row items-center justify-center gap-[10px]"
      >
        <AppImage
          src="/google-icon.svg"
          alt="google icon"
          width={26}
          height={26}
        />
        <p className="font-semibold">Sign in with Google</p>
      </AppButton> */}
    </div>
  );
};

export default SignInForm;
