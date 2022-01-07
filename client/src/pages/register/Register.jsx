import React from 'react'
import axios from "axios";
import { useRef } from "react";
import { useHistory } from "react-router";

export const Register = () => {

  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();



  const handleClick = async (e) =>{
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value){
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    }
    else {
      const user = {
        email: email.current.value,
        password: password.current.value,
      };

      console.log(user);

      try {
        const  res= await axios.post("/auth/register", user);

        console.log(res);
        history.push("/login");

        
        
      } catch (err) {
        console.log(err);
      }
    }

    
  }

    return (      
        <div className="login">
    
      <form className="loginBox"  onSubmit={handleClick}>
            
            <input placeholder="Email" type="email" required ref={email} className="loginInput" />
            <input placeholder="Password" minLength="6" type="password" ref={password}  required  className="loginInput" />
            <input placeholder="Retype Password " minLength="6" type="password" required  ref={passwordAgain}  className="loginInput" />
            <button className="loginButton" type= "submit"> Sign Up</button>
            <span className="loginForgot">Already have an account?</span>
            <button className="loginRegisterButton ">
              Sign In 
            </button>
          </form>
        
      
    </div>
    )
}
