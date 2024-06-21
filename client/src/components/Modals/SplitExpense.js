import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const SplitExpense = ({ show, setSplitBetween, closeSplit, setSplitType, splitType, amountPaid }) => {
    const users = useSelector((state) => state.group.allUsers);
    const equal = amountPaid / users.length;

    const [adjustedAmounts, setAdjustedAmounts] = useState(
        users.map((user) => ({ personName: user._id, value: equal }))
    );

    const handleAdjustChange = (index, value) => {
        const newValue = parseFloat(value);
        if (!isNaN(newValue)) {
            setAdjustedAmounts((prevAmounts) => {
                if (prevAmounts[index]) {
                    prevAmounts[index].value = newValue;
                } else {
                    prevAmounts[index] = { personName: users[index]._id, value: newValue };
                }
                return [...prevAmounts];
            });
        }
    };

    const submitHandler = () => {
        if (splitType === 'Equally') {
            const equallySplitAmounts = users.map((user) => ({ personName: user._id, value: equal }));
            setSplitBetween(equallySplitAmounts);
            closeSplit();
        } else {
            const totalAdjustedAmount = adjustedAmounts.reduce((acc, curr) => acc + curr.value, 0);
            const difference = Math.abs(totalAdjustedAmount - amountPaid);
            if (difference < 1e-9) {
                setSplitBetween(adjustedAmounts);
                closeSplit();
            } else {
                toast.error("Adjusted amounts must add up to the total amount")
            }
        }
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <FaTimes onClick={closeSplit} />
                <div>
                    <button
                        className={splitType === 'Equally' ? 'active' : ''}
                        onClick={() => setSplitType('Equally')}
                    >
                        Equally
                    </button>
                    <button
                        className={splitType === 'Adjust' ? 'active' : ''}
                        onClick={() => setSplitType('Adjust')}
                    >
                        Adjust
                    </button>
                </div>

                {users.map((user, index) => (
                    <div key={user._id}>
                        <span>{user.name}</span>
                        <input
                            readOnly={splitType === 'Equally'}
                            value={splitType === 'Equally' ? equal : adjustedAmounts[index] ? adjustedAmounts[index].value : 0}
                            onChange={(e) => handleAdjustChange(index, e.target.value)}
                        />
                    </div>
                ))}

                <button onClick={submitHandler}>Submit</button>
            </div>
        </div>
    );
};

export default SplitExpense;
