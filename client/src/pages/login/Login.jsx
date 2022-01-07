import React from 'react'
import "./login.css"
import {  useContext, useRef } from "react";

import {AuthContext} from "../context/AuthContext";

import { CircularProgress } from "@material-ui/core";

import { loginCall } from "../apiCalls";

export const Login = () => {

  const email = useRef();
  const password = useRef();

  const {user, isFetching, dispatch} = useContext(AuthContext);

  const handleClick =()=> {

    loginCall({email: email.current.value, password: password.current.value}, dispatch);


  };

  console.log(user);

 


 
    return (
        <div className="login">
      
        
        
            <form className="loginBox">
            <input placeholder="Email" type="email" ref={email} required className="loginInput"  />
            <input placeholder="Password" type="password" ref={password} required minLength="6"  className="loginInput"  />
            <button className="loginButton" type="submit" disabled={isFetching}  onClick={handleClick}>
            {isFetching? <CircularProgress color="secondary" size="30px"  />:"Log in"}</button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
            {isFetching? <CircularProgress color="secondary" size="30px"  />:"Sign up"}
            </button>
          </form>
       
     
    </div>
    )
}

