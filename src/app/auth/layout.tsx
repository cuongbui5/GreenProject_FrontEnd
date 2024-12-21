"use client"




export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <main className="flex justify-center items-center bg-brand-primary h-screen">

        {children}



    </main>
  );
}
