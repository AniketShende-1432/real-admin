import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Login from './components/login/Login';
import Admin from './components/admin/Admin';
import User from './components/admin/User';
import Property from './components/admin/Property';
import Useredit from './components/admin/Useredit';
import Editprop from './components/admin/propertyedit/Editprop';
import Editprop2 from './components/admin/propertyedit/Editprop2';
import Alist from './components/admin/manageadmin/Alist';
import Acreate from './components/admin/manageadmin/Acreate';
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/admin" element={<Admin />}>
            <Route index element={<User />} />
            <Route path="user-edit" element={<Useredit />} />
            <Route path="manage-property" element={<Property />} />
            <Route path="edit-property" element={<Editprop />} />
            <Route path="edit2-property" element={<Editprop2 />} />
            <Route path="manage-admin" element={<Alist />} />
            <Route path="admin-create" element={<Acreate />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
