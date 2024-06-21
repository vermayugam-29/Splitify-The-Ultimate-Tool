import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import Spinner from '../Spinner';



const PaidBy = ({ show, setPaidBy, closePaidBy }) => {
  const users = useSelector((state) => state.group.allUsers);
  const loading = useSelector((state) => state.loading.loading)


  if (loading) {
    return <Spinner />
  }
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content-paidby">
        <FaTimes onClick={closePaidBy} />
        {
          users.map((user) => {
            return (
              <div className='name-display' key={user._id}>
                <span onClick={() => {
                  setPaidBy({name : user.name , id : user._id})
                  closePaidBy();
                }}>{user.name}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default PaidBy
