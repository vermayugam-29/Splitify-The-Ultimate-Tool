import React from 'react'
import { useLocation } from 'react-router-dom'
import Group from '../../components/Group';

const GroupDetails = () => {
    const location = useLocation();
    const { group, currUser } = location.state || {};
    return (
        <div>
            <Group group={group} user={currUser}/>
        </div>
    )
}

export default GroupDetails
