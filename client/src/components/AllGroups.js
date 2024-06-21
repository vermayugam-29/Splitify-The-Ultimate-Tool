import React, { useState } from 'react'
import { MdDelete } from "react-icons/md";
import DeleteModal from './Modals/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';
import { getAllUsers } from '../services/groups';
import { getGroupExpenses } from '../services/expenses';
import { fetchBalance } from '../services/balance';
import { getGroupSettlements } from '../services/settlements';


const AllGroups = ({ group, currUser }) => {
  //modals
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expenses = useSelector((state) => state.expense.expenses);
  const settlements = useSelector((state) => state.settlement.settlements);
  const balances = useSelector((state) => state.balance.balances);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const clickHandler = () => {
    dispatch(getAllUsers(group._id, navigate));
    dispatch(getGroupExpenses(group._id, currUser, navigate));
    dispatch(fetchBalance(group._id, currUser, navigate));
    dispatch(getGroupSettlements(group._id, navigate));
    navigate('/Home/Group', { state: { group, currUser } });
  }

  return (
    <div className='group'>
      <h1 onClick={clickHandler}>{group.groupName}</h1>
      {
        group.admin === currUser &&
        <MdDelete onClick={handleOpen} className='delete-icon-group' />
      }
      <DeleteModal show={showModal} handleClose={handleClose} group={group} />
    </div>
  )
}

export default AllGroups
