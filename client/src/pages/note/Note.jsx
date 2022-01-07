import React from 'react'
import "./note.css";
import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';


export const Note = () => {

    const [todos, setTodos] = useState([])
    const [inputText, setInputText] = useState("")

    

    


    const todoInput = useRef('')

    const {user} = useContext(AuthContext);

    console.log(user.user._id);
    
   


    useEffect(() => {
  
        const fetchPost  = async() =>{
          

          const res =  await axios.get(`/notes/lists/${user.user._id}`);
            console.log(res);

            setTodos(res.data);
        
        }
        fetchPost();
        
      }, [user.user._id])


      const createTodo = async (text) =>{

        const res = await axios.post("/notes/", {desc: text, userId: user.user._id })
        setTodos([...todos, res.data])
       }
      
       const inputHandler = (e) =>{
         setInputText(e.target.value)
        }

        const handleSubmit = (e) => {
            e.preventDefault();
    
            createTodo(todoInput.current.value)
            setInputText("")
    
        }

        const deleteHandler = async (_id) =>
        {

                const data = await axios.delete(`/notes/delete/${_id}`)
                console.log(data);
               
                let finalTodos = todos.filter( todo => todo._id !== data.data._id);
                console.log(finalTodos);

                setTodos(finalTodos)
              


        }


        const completeHandler = async (_id)  =>
        {
           
            console.log("hi");

            const data2 = await axios.get(`/notes/complete/${_id}`)
            console.log(data2);

           setTodos (todos => todos.map(todo=> {

            if (todo._id === data2.data._id)
            {
                return {
                    ...todo, complete:!todo.complete
                }
            }
            return todo;

           } ))
        }




      

       

      

    return (
        <div className="App">
     
          <div className="top">To Do List</div>

          <div className="addwrapper"> 
                <div className="add" >

            <input  value={inputText} className="input" onChange={inputHandler}  ref={todoInput} />

            <button  className="btn"  type="button" onClick={handleSubmit}  > <i className="fas fa-plus-square"></i></button>

            </div>

        
        </div>

        <div>
            <div className="container">
        <div className="listContainer">
        {todos.map(todo => (
        <div className='list' key={todo._id} >
        <div className={`line ${todo.complete ?"completed" : ''}`}>{todo.desc}</div>
        <button   className='delete' onClick={()=>deleteHandler(todo._id)} ><i className='fas fa-minus-circle'></i></button>
        <button  className='complete' onClick={()=>completeHandler(todo._id)}  ><i className='fas fa-check-circle'></i></button>
    </div>
    ))}
       
            
        </div>
    </div>
        </div>
    </div>
    )
}
