import React from 'react';
import bellIcon from '../../../assets/images/sidebar/bell.svg';

const Activity = () => {
    
    return(
        <div className="activity-container">
            <button className="clear-btn">Clear All</button>
            <h2><img src={bellIcon} alt=""/> Notifications</h2>
            <div className="notifications-cards-container">
                <div className="notification-card">
                    <img src="" alt=""/>
                    <p className="sum"></p>
                    <p className="notification-name"></p>
                    <span className="notification-date"></span>
                </div>
            </div>
        </div>
    );
}

export default Activity;