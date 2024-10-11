import React, {useEffect, useRef} from "react";
import config from  "../configs/config";
import {Input, Button, Divider} from "@nextui-org/react";
import Logo from '../assets/icons/airremote-logo.svg?react';
import GoogleLogo from '../assets/icons/google-logo.svg?react';
import GithubLogo from '../assets/icons/github-logo.svg?react';
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <div className="flex flex-col items-center justify-center min-w-[90%] sm:min-w-[70%] md:min-w-[60%] lg:min-w-[50%] xl:min-w-[30%] 2xl:min-w-[20%]">

        {/* Logo */}
        <div className="flex flex-col justify-center items-center text-start w-full">
          <Logo className="w-64 h-16 -ml-9"/>
          <span className="text-sm text-gray-500 -mt-2">
              Create an account to get started
            </span>
        </div>

        {/* First section */}
        <div className="flex-col w-full my-5">
          <Input
            isRequired
            type="username"
            label="Username"
            placeholder="Enter your username"
            variant="bordered"
            className="border-1 rounded-t-xl remove-child-border hover:border-gray-400 focus-within:border-gray-400"
          />
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
            className="border-1 border-t-0 remove-child-border hover:border-gray-400 hover:border-t-1 focus-within:border-t-1 focus-within:border-gray-400"
          />
          <Input
            isRequired
            type="password"
            label="Password"
            placeholder="Enter your password"
            variant="bordered"
            className="border-1 border-t-0 remove-child-border hover:border-gray-400 hover:border-t-1 focus-within:border-t-1 focus-within:border-gray-400"
          />
          <Input
            isRequired
            type="password"
            label="Confirm password"
            placeholder="Confirm your password"
            variant="bordered"
            className="border-1 border-t-0 rounded-b-xl remove-child-border hover:border-gray-400 hover:border-t-1 focus-within:border-t-1 focus-within:border-gray-400"
          />
          <Button className="w-full mt-6 bg-gradient-to-tr from-blue-500 to-blue-700" color="primary">
            Sign Up
          </Button>
        </div>

        {/* Divider */}
        <div className="flex flex-row w-full justify-between items-center mb-5">
          <Divider className="max-w-[40%]"/>
          <span className="text-sm text-gray-500">
            OR
          </span>
          <Divider className="max-w-[40%]"/>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col w-full">
          <Button className="w-full bg-transparent border-2 border-gray-200 text-gray-600" color="primary">
            <GoogleLogo className="w-5"/> Sign Up with Google
          </Button>
          <Button className="w-full bg-transparent border-2 border-gray-200 text-gray-600 mt-1" color="primary">
            <GithubLogo className="w-5 h-5"/> Sign Up with Github
          </Button>
        </div>

        <div className="mt-2">
          <span className="text-sm text-gray-500 font-normal">Already have an account? <span onClick={()=>navigate('/login')} className="cursor-pointer font-medium text-blue-500 hover:text-blue-700">Log In</span></span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
