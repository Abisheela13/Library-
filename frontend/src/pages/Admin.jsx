import React,{useEffect,useState} from "react";
import api from "../services/api";

function Admin(){

 const [books,setBooks]=useState([]);
 const [history,setHistory]=useState([]);

 const [editId,setEditId]=useState(null);

 const [book,setBook]=useState({
  title:"",
  author:"",
  stock:1,
  quality:"Good"
 });

 const token = localStorage.getItem("token");

 const headers = {
  headers:{
   Authorization:`Bearer ${token}`
  }
 }

 const load = async()=>{

  const b = await api.get("/books",headers);

  const h = await api.get("/history/all",headers);

  setBooks(b.data);
  setHistory(h.data);
 }

 useEffect(()=>{
  load();
 },[])

 const addBook = async()=>{

  if(!book.title || !book.author){
   return alert("Fill all fields");
  }

  await api.post("/books",book,headers);

  resetForm();

  load();
 }

 const updateBook = async()=>{

  await api.put(
   `/books/${editId}`,
   book,
   headers
  );

  resetForm();

  load();
 }

 const resetForm = ()=>{

  setBook({
   title:"",
   author:"",
   stock:1,
   quality:"Good"
  });

  setEditId(null);
 }

 const deleteBook = async(id)=>{

  await api.delete(`/books/${id}`,headers);

  load();
 }

 const approve = async(id)=>{

  await api.post(`/approve/${id}`,{},headers);

  load();
 }

 const editBook = (b)=>{

  setBook({
   title:b.title,
   author:b.author,
   stock:b.stock,
   quality:b.quality
  });

  setEditId(b.id);

  window.scrollTo({
   top:0,
   behavior:"smooth"
  });
 }

 const logout = ()=>{

  localStorage.removeItem("token");

  localStorage.removeItem("role");

  window.location.href="/";
 }

 return(

  <div className="container py-4">

   <div className="d-flex justify-content-between align-items-center mb-4">

    <h2 className="fw-bold">
     Admin Dashboard
    </h2>

    <button
    className="btn btn-dark"
    onClick={logout}
    >
     Logout
    </button>

   </div>

   <div className="row mb-4">

    <div className="col-md-3 mb-3">
     <div className="card p-3 shadow text-center">
      <h5>Total Books</h5>
      <h3>{books.length}</h3>
     </div>
    </div>

    <div className="col-md-3 mb-3">
     <div className="card p-3 shadow text-center">
      <h5>Total Borrow</h5>
      <h3>{history.length}</h3>
     </div>
    </div>

    <div className="col-md-3 mb-3">
     <div className="card p-3 shadow text-center">
      <h5>Pending Returns</h5>

      <h3>
       {
        history.filter(
         h=>h.status==="RETURN_REQUESTED"
        ).length
       }
      </h3>
     </div>
    </div>

    <div className="col-md-3 mb-3">
     <div className="card p-3 shadow text-center">
      <h5>Available Stock</h5>

      <h3>
       {
        books.reduce((a,b)=>a+b.stock,0)
       }
      </h3>
     </div>
    </div>

   </div>

   <div className="card p-3 shadow mb-4">

    <h5 className="mb-3">

     {
      editId ? "Edit Book" : "Add Books"
     }

    </h5>

    <input
    className="form-control mb-2"
    placeholder="Title"
    value={book.title}
    onChange={(e)=>
    setBook({...book,title:e.target.value})}
    />

    <input
    className="form-control mb-2"
    placeholder="Author"
    value={book.author}
    onChange={(e)=>
    setBook({...book,author:e.target.value})}
    />

    <input
    type="number"
    className="form-control mb-2"
    placeholder="Stock"
    value={book.stock}
    onChange={(e)=>
    setBook({...book,stock:Number(e.target.value)})}
    />

    <select
    className="form-control mb-3"
    value={book.quality}
    onChange={(e)=>
    setBook({...book,quality:e.target.value})}
    >
     <option>Good</option>
     <option>Average</option>
     <option>Bad</option>
    </select>

    {
     editId ? (

      <div className="d-flex gap-2">

       <button
       className="btn btn-success w-50"
       onClick={updateBook}
       >
        Update Book
       </button>

       <button
       className="btn btn-secondary w-50"
       onClick={resetForm}
       >
        Cancel
       </button>

      </div>

     ) : (

      <button
      className="btn btn-dark"
      onClick={addBook}
      >
       Add Book
      </button>

     )
    }

   </div>

   <div className="row">

   {books.map((b)=>(

    <div
    className="col-md-4 mb-3"
    key={b.id}
    >

     <div className="card p-3 shadow-sm h-100">

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

      <div className="d-flex gap-2 mt-auto">

       <button
       className="btn btn-warning w-50"
       onClick={()=>editBook(b)}
       >
        Edit
       </button>

       <button
       className="btn btn-danger w-50"
       onClick={()=>deleteBook(b.id)}
       >
        Delete
       </button>

      </div>

     </div>

    </div>

   ))}

   </div>

   <div className="card p-3 shadow mt-4">

    <h4 className="mb-3">
     Borrow Requests
    </h4>

    {
     history.length===0 &&
     <p>No Requests</p>
    }

    {history.map((h)=>(

     <div
     key={h.id}
     className="border rounded p-3 mb-3"
     >

      <p>
       <strong>User :</strong>
       {" "}
       {h.user.name}
      </p>

      <p>
       <strong>Book :</strong>
       {" "}
       {h.book.title}
      </p>

      <p>
       <strong>Status :</strong>
       {" "}
       {h.status}
      </p>

      <p>
       <strong>Borrow Days :</strong>
       {" "}
       {h.days || 0}
      </p>

      {h.status==="RETURN_REQUESTED" && (

       <button
       className="btn btn-success"
       onClick={()=>approve(h.id)}
       >
        Approve Return
       </button>

      )}

     </div>

    ))}

   </div>

  </div>
 )
}

export default Admin;