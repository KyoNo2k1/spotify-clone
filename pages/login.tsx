import { GetServerSideProps } from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import SpotifyIcon from "../assets/spotify-logo.png";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

const Login = ({ providers }: Props) => {
  const { name: providerName, id: providerId } =
    providers?.spotify as ClientSafeProvider;
  return (
    <div className="flex flex-col justify-center items-center bg-black h-screen">
      <div className="mb-6">
        <Image src={SpotifyIcon} alt="Spotify Icon" width={300} height={300} />
      </div>
      <button
        className="bg-[#18d860] text-white p-5 rounded-full"
        onClick={() => signIn(providerId, { callbackUrl: "/" })}
      >
        Login with {providerName}
      </button>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};