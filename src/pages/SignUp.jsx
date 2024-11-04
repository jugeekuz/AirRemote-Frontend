import React, {useEffect, useState} from "react";
import {Input, Button, Divider, Spinner} from "@nextui-org/react";
import Logo from '../assets/icons/airremote-logo.svg?react';
import GoogleLogo from '../assets/icons/google-logo.svg?react';
import GithubLogo from '../assets/icons/github-logo.svg?react';
import { useNavigate } from "react-router-dom";
import useError from "../hooks/useError";
import ModalError from "../components/ModalError";
import { signup } from "../services/authenticate";
const SignUp = () => {
  const navigate = useNavigate();
  const attributes = useError("");

  const [username, setUsername] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [isValidUser, setIsValidUser] = useState(true);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = React.useState(false);
  const [isValidPass, setIsValidPass] = useState(true);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isValidPassConf, setIsValidPassConf] = useState(true);
  const [isVisibleConf, setIsVisibleConf] = React.useState(false);

  const validate = () => {
    const usernameRegex = /^[a-zA-z0-9_.]{1,32}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{1,64}$/;
    let validFlag = true;
    if (!usernameRegex.test(username)){
      setIsValidUser(false);
      validFlag = false;
    }
    if (!emailRegex.test(email)){
      setIsValidEmail(false);
      validFlag = false;
    }
    if (!passwordRegex.test(password)){
      setIsValidPass(false);
      validFlag = false;
    }
    if (password !== passwordConfirmation){
      setIsValidPass(false);
      setIsValidPassConf(false);
      validFlag = false;
    }
    return validFlag;
  }

  const signUp = () => {
    if (!validate()) return;
    setSignupLoading(true);
    signup(username, email, password)
    .then(() => {
      setSignupLoading(false);
      navigate('/login');
    })
    .catch((error) => {
      setSignupLoading(false);
      return error.response ? alert(error.response.data.message) : alert(error.message)
    })

  }
  const handleSubmit = (e) => {
    e.preventDefault(); 
    signUp();
  };
  
  return (
    <>
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
          <form onSubmit={handleSubmit} className="flex-col w-full">
            <Input
              isRequired     
              value={username}       
              isInvalid={!isValidUser}
              onValueChange={setUsername}
              type="username"
              label="Username"
              placeholder="Enter your username"
              variant="bordered"
              className={` ${ !isValidUser? "border-2 !border-red-400": "border-1"} rounded-t-xl remove-child-border hover:border-gray-400 focus-within:border-gray-400`}
            />
            <Input
              isRequired
              value={email}       
              isInvalid={!isValidEmail}
              onValueChange={setEmail}
              type="email"
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              className={`${ !isValidEmail? "border-2 !border-red-400": "border-1 border-t-0 "} remove-child-border hover:border-gray-400 hover:border-t-1 focus-within:border-t-1 focus-within:border-gray-400`}
            />
            <Input
              isRequired
              value={password}       
              isInvalid={!isValidPass}
              onValueChange={setPassword}
              type={isVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              className={`${ !isValidPass? "border-2 !border-red-400": "border-1  border-t-0"} remove-child-border hover:border-gray-400 hover:border-t-1 focus-within:border-t-1 focus-within:border-gray-400`}
              endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)} aria-label="toggle password visibility">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            <Input
              isRequired
              value={passwordConfirmation}       
              isInvalid={!isValidPassConf}
              onValueChange={setPasswordConfirmation}
              type={isVisibleConf ? "text" : "password"}
              label="Confirm password"
              placeholder="Confirm your password"
              variant="bordered"
              className={`${ !isValidPassConf? "border-2 !border-red-400": "border-1 border-t-0 "} rounded-b-xl remove-child-border hover:border-gray-400 hover:border-t-1 focus-within:border-t-1 focus-within:border-gray-400`}
              endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsVisibleConf(!isVisibleConf)} aria-label="toggle password visibility">
                  {isVisibleConf ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            <Button
              type="submit"
              className="w-full mt-6 bg-gradient-to-tr from-blue-500 to-blue-700"
              color="primary"
            >
              {signupLoading ? <Spinner/> : "Sign Up"}
            </Button>
          </form>
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
    <ModalError {...attributes} />
    </>
  );
};

const EyeSlashFilledIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
      fill="currentColor"
    />
    <path
      d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
      fill="currentColor"
    />
    <path
      d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
      fill="currentColor"
    />
    <path
      d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
      fill="currentColor"
    />
    <path
      d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
      fill="currentColor"
    />
  </svg>
);

export const EyeFilledIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
      fill="currentColor"
    />
    <path
      d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
      fill="currentColor"
    />
  </svg>
);
export default SignUp;
