import Image from "next/image";
import React from "react";

const providers = [
  {
    provider: "google",
    label: "Continue with Google",
    icon: "/Image/google.png",
    size: 20,
  },
  {
    provider: "facebook",
    label: "Continue with Facebook",
    icon: "/Image/facebook.png",
    size: 20,
  },
  {
    provider: "twitter",
    label: "Continue with Twitter",
    icon: "/Image/twitter.png",
    size: 20,
  },
  {
    provider: "github",
    label: "Continue with GitHub",
    icon: "/Image/github.png",
    size: 20,
  },
];
function SocialAutProvider() {
    const handleSupabase = async(providers) => {
        const subase = createClient();
        await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `http://example.com/auth/callback`,
  },
})

    }
  return (
    <div>
      {providers.map((provider) => (
        <div key={provider.name} onClick={() => handleSupabase(provider.name)} className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 cursor-pointer" >
          <Image
            src={provider.icon}
            alt={`${provider.provider} icon`}
            width={provider.size}
            height={provider.size}
            className="inline-block mr-2"
          />
        </div>
      ))}
    </div>
  );
}

export default SocialAutProvider;
