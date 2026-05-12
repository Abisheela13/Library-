
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import User from "./pages/User";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/user" element={<User/>}/>
    </Routes>
  )
}
export default App;
