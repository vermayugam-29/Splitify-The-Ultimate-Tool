import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { joinGroup } from '../../services/groups';

const DeleteModal = ({ show, handleClose2 , members}) => {

  const [joinCode , setJoinCode] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const joinHandler = () =>  {
    dispatch(joinGroup(members,joinCode,navigate));
  }


  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content-delete">
        <div className='delete-group'>
          <input onChange={(e) => setJoinCode(e.target.value)} value={joinCode}
          className='input-modal' placeholder='Enter join-code'/>
          <button onClick={handleClose2}>Cancel</button>
          <button onClick={joinHandler}>Join Group</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
