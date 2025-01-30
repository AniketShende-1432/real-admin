import {React, useState} from 'react'
import Acreate from './Acreate'
import Alist from './Alist'

const Madmin = () => {
    const [List,setList] = useState(true);
  return (
    <div>
        {List ? <Alist setList={setList}/> : <Acreate />}
    </div>
  )
}

export default Madmin