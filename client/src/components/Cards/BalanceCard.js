import React from 'react'
import ConfirmationModal from '../Modals/ConfirmationModal';
import { useState } from 'react';

const BalanceCard = ({ balance, user, group }) => {
    const [showSettleModal, setShowSettleModal] = useState(false);
    const closeSettleBalance = () => {
        setShowSettleModal(false);
    }
    const [dataToBeSent, setData] = useState(null);
    const msg = 'Are you sure you want to settle this ?'

    return (
        <div>
            {
                balance.amount !== 0 && (
                    <span>
                        You {balance.amount < 0 ? 'borrowed ' : 'lent'} ₹{Math.abs(balance.amount)}
                        {balance.amount < 0 ? ' from ' : ' to '} {balance.name}
                        {balance.amount < 0 && (
                            <span className='settle-btn' onClick={() => {
                                const data = {
                                    groupName: group._id,
                                    paidBy: user,
                                    paidTo: balance.paidFor,
                                    amount: Math.abs(balance.amount)
                                }
                                setData(data);
                                setShowSettleModal(true);
                            }}>
                                Settle with {balance.name}
                            </span>
                        )}
                    </span>
                )
            }

            <ConfirmationModal show={showSettleModal}
                closeModal={closeSettleBalance} message={msg} cameFrom={'settle'}
                data={dataToBeSent}
            />
        </div>
    )
}

export default BalanceCard
