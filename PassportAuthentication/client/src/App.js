import "./App.css";
import Login from "./pages/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import './App.css';


const App = () => {


  const [user, setUser] = useState(null);

  useEffect(()=>{

    const getUser = ()=>{
      fetch("http://localhost:5000/auth/login/success", {

        method:"GET", 
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
       .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("authentication has been failed!");
       })
       .then((resObject) => {
        setUser(resObject.user);
      })
       .catch((err) => {
        console.log(err);
      });
    };
    getUser();
  },[]);

  
  return (
    <BrowserRouter>
    <div>      
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login/>}        />       
      </Routes>
    </div>
    </BrowserRouter>
  );
  
};

export default App;