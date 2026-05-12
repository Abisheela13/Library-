import React,{useState} from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login(){

 const nav = useNavigate();

 const [data,setData] = useState({
  email:"",
  password:""
 });

 const login = async()=>{

 try{

  const res = await api.post("/login",data);

  localStorage.setItem(
   "token",
   res.data.token
  );

  localStorage.setItem(
   "role",
   res.data.user.role
  );

  localStorage.setItem(
   "user",
   JSON.stringify(res.data.user)
  );

  if(res.data.user.role==="ADMIN"){

   nav("/admin");

  }else{

   nav("/user");
  }

 }catch(err){

  console.log(err);

  alert(
   err.response?.data?.msg || "Login Failed"
  );
 }
}
 return(

  <div className="container py-5">

   <div className="row justify-content-center">

    <div className="col-md-5">

     <div className="card shadow p-4">

      <h3 className="text-center mb-4">
       Library Login
      </h3>

      <input
      className="form-control mb-3"
      placeholder="Email"
      value={data.email}
      onChange={(e)=>
      setData({
       ...data,
       email:e.target.value
      })}
      />

      <input
      type="password"
      className="form-control mb-3"
      placeholder="Password"
      value={data.password}
      onChange={(e)=>
      setData({
       ...data,
       password:e.target.value
      })}
      />

      <button
      className="btn btn-dark w-100"
      onClick={login}
      >
       Login
      </button>

      <button
      className="btn btn-warning w-100 mt-2"
      onClick={()=>{
       setData({
        email:"abi@gmail.com",
        password:"123456"
       });
      }}
      >
       Fill Admin Login
      </button>

      <Link
      to="/register"
      className="mt-3 text-center"
      >
       New User? Register
      </Link>

     </div>

    </div>

   </div>

  </div>
 )
}

export default Login;