import Image from "next/image";

export default function Layout({ children }: { children: React.ReactElement }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center items-center mb-8 mr-4">
          <Image
            className="dark:invert"
            src="/SyncForge-transparent.png"
            alt="Next.js logo"
            width={190}
            height={0}
            priority
          />
        </div>
        {children}
      </div>
    </div>
  );
}
