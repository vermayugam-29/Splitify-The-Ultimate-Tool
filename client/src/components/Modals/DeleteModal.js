import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteGroup } from '../../services/groups';

const DeleteModal = ({ show, handleClose , group}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteHandler = () =>  {
    dispatch(deleteGroup(group._id,navigate));
  }


  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content-delete">
        <div className='delete-group'>
          <h1 className='delete-msg'>Do you really wish to delete '
            <span>{group.groupName}</span>' ?</h1>
          <button onClick={handleClose}>Cancel</button>
          <button onClick={deleteHandler}>Delete Group</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
