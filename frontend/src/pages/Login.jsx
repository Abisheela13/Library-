
import React,{useState} from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login(){
 const nav = useNavigate();
 const [data,setData] = useState({email:"",password:""});

 const login = async()=>{
  const res = await api.post("/login",data);

  localStorage.setItem("token",res.data.token);
  localStorage.setItem("role",res.data.user.role);

  if(res.data.user.role==="ADMIN"){
   nav("/admin");
  }else{
   nav("/user");
  }
 }

 return(
  <div className="container py-5">
   <div className="row justify-content-center">
    <div className="col-md-5">
     <div className="card shadow p-4">
      <h3 className="text-center mb-4">Library Login</h3>

      <input className="form-control mb-3" placeholder="Email"
      onChange={(e)=>setData({...data,email:e.target.value})}/>

      <input type="password" className="form-control mb-3" placeholder="Password"
      onChange={(e)=>setData({...data,password:e.target.value})}/>

      <button className="btn btn-dark w-100" onClick={login}>Login</button>

      <Link to="/register" className="mt-3 text-center">New User? Register</Link>
     </div>
    </div>
   </div>
  </div>
 )
}
export default Login;
