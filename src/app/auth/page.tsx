"use client";

import SignUpForm from "@/app/auth/_components/SignUpForm";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "@/app/auth/_components/SignInForm";
import {useAuthStore} from "@/app/store/AuthStore";


export default function page() {
  const {pathname}=useAuthStore(state => state);



  return (
    <div className="flex flex-col md:flex-row justify-center items-center bg-white lg:shadow-lg rounded-xl lg:my-10 my-6 mx-4 lg:mx-0">
      {/* Form Section */}
      <div className="flex flex-col flex-1 justify-center p-6 lg:p-10 lg:w-[500px] w-full">
        <AnimatePresence mode="wait">
          {pathname === "/register" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >

              <SignUpForm  />
            </motion.div>
          )}

          {pathname === "/login" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >

              <SignInForm  />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Section */}
      <div
        className="relative hidden md:block md:w-[330px] lg:w-[530px] h-[550px] rounded-r-xl overflow-hidden"
        style={{
          backgroundImage: "url(/images/image_signup.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
