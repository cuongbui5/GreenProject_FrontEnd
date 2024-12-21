import React from "react";
import Header from "@/app/(client)/_components/Header";
import Sidebar from "@/app/(client)/_components/Sidebar";
import Footer from "@/app/(client)/_components/Footer";

export default function ProfileLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
                <div className="flex w-full h-screen justify-between my-16 px-6">
                    <Sidebar />
                    {children}
                </div>
    );
}