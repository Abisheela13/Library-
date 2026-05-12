
import React,{useState} from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){
 const nav = useNavigate();
 const [data,setData] = useState({
  name:"",
  email:"",
  password:""
 });

 const register = async()=>{
  await api.post("/register",data);
  alert("Registered");
  nav("/");
 }

 return(
  <div className="container py-5">
   <div className="row justify-content-center">
    <div className="col-md-5">
     <div className="card shadow p-4">
      <h3 className="text-center mb-4">User Register</h3>

      <input className="form-control mb-3" placeholder="Name"
      onChange={(e)=>setData({...data,name:e.target.value})}/>

      <input className="form-control mb-3" placeholder="Email"
      onChange={(e)=>setData({...data,email:e.target.value})}/>

      <input type="password" className="form-control mb-3" placeholder="Password"
      onChange={(e)=>setData({...data,password:e.target.value})}/>

      <button className="btn btn-primary w-100" onClick={register}>Register</button>
     </div>
    </div>
   </div>
  </div>
 )
}
export default Register;
