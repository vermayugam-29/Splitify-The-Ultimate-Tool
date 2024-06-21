import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logOut } from '../services/auth';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ProfileModal from './Modals/ProfileModal';

const NavBar = () => {

    const userDetails = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.loading.loading);
    const navigate = useNavigate();

    const [showModal , setShowModal] = useState(false);
    const handleClose = () => {
        setShowModal(false);
    }


    if (loading) {
        return (
            <Spinner></Spinner>
        )
    }



    return (
        <nav className='navbar'>
            <div className='logo' onClick={() => {
                if (!userDetails) {
                    toast.error('Please Login First to Go to Home Page')
                }
                navigate('/Home')
            }}>
                <span className='first'>Spliti</span>
                <span className='last'>Fi</span>
            </div>
            <div>
                {
                    !userDetails ?
                        (
                            <NavLink to='/login'>
                                <button className='login-btn'> LogIn </button>
                            </NavLink>
                        ) :
                        (
                            <div onClick={() => setShowModal(true)} className='profile-img-div'>
                                <img src={userDetails.data.imageUrl} className='profile-img' />
                            </div>
                        )
                }
            </div>
            <ProfileModal show={showModal} close={handleClose}/>
        </nav>
    )
}

export default NavBar
