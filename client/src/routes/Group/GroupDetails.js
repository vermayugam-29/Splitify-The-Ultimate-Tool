import React , {useEffect} from 'react'
import { useLocation , useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Group from '../../components/Group';

const GroupDetails = () => {
    const location = useLocation();
    const { group, currUser } = location.state || {};
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || group === null) {
            navigate('/');
        }
    }, [user , group])

    if(!group || !user){
        return (
            navigate('/')
        )
    }

    return (
        <div>
            <Group group={group} user={currUser} />
        </div>
    )
}

export default GroupDetails
