import React from 'react'
import { Link, useNavigate,Outlet } from 'react-router-dom';

const Alist = () => {
  return (
    <div>
         <div>Alist</div>
         <button><Link className="nav-link active text-white small" aria-current="page" to='/admin/admin-create'>Create</Link></button>
    </div>
  )
}

export default Alist