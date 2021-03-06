import React, { useEffect } from 'react'
import { Button } from 'antd'

import { getCurrentProfile } from '../../appRedux/actions/profile'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Dashboard = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentProfile());
    }, [])

    const { user } = useSelector(state => state.auth)
    const { profile } = useSelector(state => state.profile)
    
    return (
        <div>
            <h1 style={{ color: 'blue', marginTop: 20 }}> Dashboard</h1>
            <p className='lead'>
                <i className="fas fa-user"> Welcome {user && user.name}</i>
            </p>
            {profile == null ?
            <div>
                <p>You have not setup profile, please add some info</p>
                <Link to="/create-profile"> <Button> Create Profile</Button></Link>
            </div>
            :
            <div> <Link to="/create-profile"> <Button> View Profile</Button></Link></div>}
        </div>
    );
}

export default Dashboard;