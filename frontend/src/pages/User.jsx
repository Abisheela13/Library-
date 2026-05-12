import React,{useEffect,useState} from "react";
import api from "../services/api";

function User(){

 const [books,setBooks]=useState([]);
 const [history,setHistory]=useState([]);

 const token = localStorage.getItem("token");

 const user = JSON.parse(localStorage.getItem("user"));

 const headers = {
  headers:{
   Authorization:`Bearer ${token}`
  }
 }

 const load = async()=>{

  const b = await api.get("/books",headers);

  const h = await api.get("/history",headers);

  setBooks(b.data);

  setHistory(h.data);
 }

 useEffect(()=>{
  load();
 },[])

 const borrowBook = async(id)=>{

  await api.post(`/borrow/${id}`,{},headers);

  load();
 }

 const requestReturn = async(id)=>{

  await api.post(`/return/${id}`,{},headers);

  load();
 }

 const logout = ()=>{

  localStorage.removeItem("token");

  localStorage.removeItem("role");

  localStorage.removeItem("user");

  window.location.href="/";
 }

 return(

  <div className="container-fluid">

   <div className="row min-vh-100">

    {/* SIDEBAR */}

    <div className="col-md-3 bg-dark text-white p-4">

     <h3 className="mb-4">
      User Profile
     </h3>

     <div className="card p-3 text-dark mb-3">

      <h5>
       {user?.name}
      </h5>

      <p className="mb-1">
       {user?.email}
      </p>

      <p className="mb-0">
       Role : USER
      </p>

     </div>

     <div className="card p-3 text-dark mb-3">

      <h5>
       Borrow Limit
      </h5>

      <p className="mb-0">
       Max 2 Books
      </p>

     </div>

     <div className="card p-3 text-dark mb-3">

      <h5>
       Return Days
      </h5>

      <p className="mb-0">
       7 Days Limit
      </p>

     </div>

     <button
     className="btn btn-danger w-100"
     onClick={logout}
     >
      Logout
     </button>

    </div>

    {/* MAIN CONTENT */}

    <div className="col-md-9 p-4">

     <h2 className="fw-bold mb-4">
      Library Books
     </h2>

     <div className="row">

      {books.map((b)=>(

       <div
       className="col-md-4 mb-3"
       key={b.id}
       >

        <div className="card p-3 shadow h-100">

         <h4>{b.title}</h4>

         <p className="mb-1">
          Author : {b.author}
         </p>

         <p className="mb-1">
          Stock : {b.stock}
         </p>

         <p>
          Quality : {b.quality}
         </p>

         <button
         className="btn btn-dark mt-auto"
         disabled={b.stock===0}
         onClick={()=>borrowBook(b.id)}
         >
          {
           b.stock===0
           ? "Out Of Stock"
           : "Borrow Book"
          }
         </button>

        </div>

       </div>

      ))}

     </div>

     <div className="card p-3 shadow mt-4">

      <h3 className="mb-3">
       Borrow History
      </h3>

      {
       history.length===0 &&
       <p>No Borrow History</p>
      }

      {history.map((h)=>(

       <div
       key={h.id}
       className="border rounded p-3 mb-3"
       >

        <h5>
         {h.book.title}
        </h5>

        <p className="mb-1">
         Status : {h.status}
        </p>

        <p className="mb-1">
         Borrow Date :
         {" "}
         {new Date(h.borrowDate).toLocaleDateString()}
        </p>

        <p className="mb-2">
         Total Days :
         {" "}
         {h.days || 0}
        </p>

        {
         h.status==="BORROWED" && (

          <button
          className="btn btn-warning"
          onClick={()=>requestReturn(h.id)}
          >
           Request Return
          </button>

         )
        }

       </div>

      ))}

     </div>

    </div>

   </div>

  </div>
 )
}

export default User;
