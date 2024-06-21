import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../services/groups';
import Spinner from '../Spinner';
const CreateGroup = ({ show, handleClose, admin }) => {

  const [groupName, setGrpName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setGrpName(e.target.value);
  }
  const submitHandler = () => {
    dispatch(createGroup(groupName, admin, navigate));
  }
  const loading = useSelector((state) => state.loading.loading)

  if (loading) {
    return <Spinner />
  }

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <div className='create-group'>
          <input onChange={changeHandler} value={groupName}
            className='input-modal' placeholder='Enter Group Name' required />

          <button onClick={handleClose}>Cancel</button>
          <button className='create-grp-submit' onClick={submitHandler}>Create Group</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
