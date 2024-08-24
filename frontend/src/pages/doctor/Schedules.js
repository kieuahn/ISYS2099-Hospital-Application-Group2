import React from 'react'
import Calendar from '../../components/Calendar/Calendar'
import CustomPositionPage from '../../components/Layout/CustomPositionPage'

const Schedules = () => {
    return (
        <div>
            <CustomPositionPage>
                <Calendar />
            </CustomPositionPage>
        </div>
    )
}

export default Schedules
