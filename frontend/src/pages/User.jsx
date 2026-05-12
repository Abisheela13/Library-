import React,{useEffect,useState} from "react";
import api from "../services/api";

function User(){

 const [books,setBooks] = useState([]);
 const [history,setHistory] = useState([]);

 const token = localStorage.getItem("token");

 const user = JSON.parse(
  localStorage.getItem("user")
 );

 const headers = {
  headers:{
   Authorization:`Bearer ${token}`
  }
 }

 const load = async()=>{

  try{

   const b = await api.get(
    "/books",
    headers
   );

   const h = await api.get(
    "/history",
    headers
   );

   setBooks(b.data);

   setHistory(h.data);

  }catch(err){

   console.log(err);

   alert("Failed To Load Data");
  }
 }

 useEffect(()=>{
  load();
 },[]);


 // ================= BORROW =================

 const borrowBook = async(id)=>{

  try{

   const borrowedBooks = history.filter(
    h =>
    h.status==="BORROWED" ||
    h.status==="RETURN_REQUESTED"
   );

   if(borrowedBooks.length >= 2){

    return alert(
     "Borrow Limit Reached"
    );
   }

   await api.post(
    `/borrow/${id}`,
    {},
    headers
   );

   alert("Book Borrowed");

   load();

  }catch(err){

   console.log(err);

   alert(
    err.response?.data?.msg ||
    "Borrow Failed"
   );
  }
 }


 // ================= RETURN =================

 const requestReturn = async(id)=>{

  try{

   await api.post(
    `/return/${id}`,
    {},
    headers
   );

   alert("Return Requested");

   load();

  }catch(err){

   console.log(err);

   alert("Return Failed");
  }
 }


 // ================= LOGOUT =================

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
       {user?.name || "User"}
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


    {/* MAIN */}

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


     {/* HISTORY */}

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
         {
          new Date(
           h.createdAt
          ).toLocaleDateString()
         }
        </p>

        <button
        className={
         h.status==="RETURNED"
         ? "btn btn-success"
         : h.status==="RETURN_REQUESTED"
         ? "btn btn-warning"
         : "btn btn-dark"
        }
        disabled={
         h.status!=="BORROWED"
        }
        onClick={()=>
        requestReturn(h.id)}
        >

         {
          h.status==="BORROWED"
          ? "Request Return"
          : h.status==="RETURN_REQUESTED"
          ? "Pending Approval"
          : "Returned"
         }

        </button>

       </div>

      ))}

     </div>

    </div>

   </div>

  </div>
 )
}

export default User;