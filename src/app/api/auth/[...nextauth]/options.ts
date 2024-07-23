import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/services/auth';
import apiInstance from '@/services';

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username:',
          type: 'text',
          placeholder: 'Username',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'Password',
        },
        email: {
          label: 'email:',
          type: 'email',
          placeholder: 'Email',
        },
      },
      async authorize(credentials): Promise<any> {
        if (credentials?.email && credentials?.password) {
          try {
            const data = await login(credentials.email, credentials.password);

            if (!data.data.isConfirmed) {
              throw new Error(
                'Your Account is not verified, Please check your email for verification email'
              );
            }

            if (data.data.use == 'RESIDENTIAL') {
              return null;
            }

            const jwtToken = data.data.token;

            return {
              email: data.data.email,
              id: data.data.id.toString(),
              jwtToken,
              role:
                data.data.use === 'COMMERCIAL'
                  ? 'user'
                  : data.data.use.toLowerCase(),
              name: data.data.firstName,
              detail: data.data,
            };
          } catch (error: any) {
            let errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              'Network Error! Try again later';

            // let statusCode = error?.response?.data?.statusCode || 0;

            // console.log(error?.response?.data?.message);

            // if (statusCode === 401) {
            //   errorMessage = 'Please enter Correct Email or Password';
            // } else if (statusCode === 404) {
            //   errorMessage = `Oops! Something went wrong on our end. Our team has been notified, and we're working to fix it. Please try again later`;
            // } else {
            //   errorMessage =
            //     error?.response?.data?.message ||
            //     'Network Error! Try again later';
            // }
            throw new Error(errorMessage);
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.jwtToken = user.jwtToken;
        token.role = user.role;
        token.detail = user.detail;
      }
      return token;
    },
    async session({ session, user, token }: any) {
      const getUpdatedData = async (userId: number) => {
        try {
          const response = await apiInstance.get(`users/${userId}/profile`, {
            headers: {
              Authorization: `Bearer ${token?.detail?.token}`,
            },
          });
          const userData = response.data.data;
          return userData;
        } catch (error) {
          throw error;
        }
      };

      if (token) {
        session.jwtToken = token.jwtToken as string;
        session.user.role = token.role as string;
        session.user.detail = token.detail as any;
      }

      if (token?.detail?.id) {
        await getUpdatedData(token.detail.id).then((userData) => {
          session.user.detail = userData;
        });
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};

export default options;
