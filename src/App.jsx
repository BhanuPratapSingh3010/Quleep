import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import PostDetails from './pages/PostDetails'
const App = () => {

  let userStore=useSelector((state)=>state.user)
  console.log(userStore)
   let login=userStore.login

  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={login ?<Home/>:<Navigate to='/login'/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
    </Router>
    </>
  )
}

export default App