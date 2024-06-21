import React from 'react'
import { months } from '../../months';

const SettlementCard = ({ settlement , user }) => {
    const date = settlement.updatedAt.substring(0, 10).split('-');
    return (
        <div className='expense-container'>
            <div className='date-settle'>
                <span>{date[1].charAt(0) === '0' ?
                 months[parseInt(date[1].substring(1))] :
                 months[parseInt(date[1])]}</span>

                <span>{date[2]}</span>
                <span>{date[0]}</span>
            </div>

            <div className='para-settle'>
                {
                settlement.paidById === user ? `You have` :
                `${settlement.paidByName} has`
                } settled 
                ₹{settlement.amount} with {
                    settlement.paidToId === user  ? 'You' :
                    settlement.paidToName
                } till date
            </div>
        </div>
    )
}

export default SettlementCard