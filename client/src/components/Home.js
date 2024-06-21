import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AllGroups from './AllGroups';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import TypingAnimation from './TypingAnimate/TypingAnimation';
import CreateGroup from './Modals/CreateGroup.js';
import Spinner from './Spinner.js'
import { RiUserAddLine } from "react-icons/ri";
import JoinGroup from './Modals/JoinGroup.js'


const Home = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const groups = useSelector((state) => state.group.groups)

  //modals
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const [showModal2, setShowModal2] = useState(false);

  const handleOpen2 = () => {
    setShowModal2(true);
  };

  const handleClose2 = () => {
    setShowModal2(false);
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [])

  if(loading){
    return (
      <Spinner></Spinner>
    )
  }

  if (!user) {
    return<div>No user found</div>
  }

  return (
    <div className='home-container'>
      <div className='home-name'>
        <TypingAnimation />
        <h1 className='name'>{user.data.name}</h1>
      </div>

      {
        groups && groups.length > 0 ?
          (
            <div>
              {
                groups.map((group) => {
                  return <AllGroups key={group._id} group={group} currUser={user.data._id}/>
                })
              }
            </div>
          ) :
          (
            <div className='heading'>
              You are currently not in any group 
            </div>
          )
      }

      <div className="add-groups-container">
        <div onClick={handleOpen} className="add-groups">
          <FaPlus onClick={handleOpen} className="add-groups-icon" />
        </div>
      </div>
      <div className="join-group-container">
        <div onClick={handleOpen2} className="join-group">
            <RiUserAddLine className='join-group-icon'/>
        </div>
      </div>
      <JoinGroup show={showModal2} handleClose2={handleClose2} members={user.data.email}/>
      <CreateGroup show={showModal} handleClose={handleClose} admin={user.data.email}/>
    </div>
  )
}

export default Home
