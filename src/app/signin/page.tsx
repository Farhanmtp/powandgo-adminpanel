import SignInForm from '@/components/Signin/SigninForm';
import AppImage from '@/components/Base/AppImage';
import { getServerSession } from 'next-auth';
import options from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'powandgo - Login',
  description: 'Launching Soon',
};

interface SignInProps {}

const SignIn: React.FC<SignInProps> = async () => {
  const data = await getServerSession(options);

  if (data) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col gap-[40px] my-[24px] mx-[20px]">
        <div className="w-fit mx-auto">
          <AppImage
            src="/site/logo.svg"
            alt="website logo"
            width={174}
            height={42}
          />
        </div>
        <div className="flex gap-[16px] flex-col max-w-[720px] mx-auto">
          <p className="text-center text-[24px] sm:text-[32px] font-semibold leading-[normal] max-w-[687px]">
            We revolutionized the world of electric mobility
          </p>
          <p className="text-center text-[12px] text-base leading-[26px] max-w-[679px]">
            The first charge sharing service that will change the way you charge
            your electric vehicle, saving all car owners money and allowing
            charging station owners to earn.
          </p>
        </div>
        <SignInForm />
        <div className="text-right mt-4">
          <Link href="/privacy-policy">
            <span className="text-lime-500 underline cursor-pointer">
              Privacy Policy
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
