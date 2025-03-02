import { useState } from 'react'
import '../App.css'


const BudgetCard = ({icon,budget,spend,category}) => {
    return (
        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className='card Card p-3'>
                <div className='d-flex flex-1 flex-row justify-content-between'>
                    <p className='fs-4'>{icon}</p>
                    <div className='text-center'>
                        <p className='mb-0 fs-5 fw-bold'>{category}</p>
                        <p className='mt-0'>0 items</p>
                    </div>
                    <p className='fw-bold fs-5 text-success'>Rs {budget}</p>
                </div>
                <div className='mt-2'>
                    <div className='d-flex flex-row flex-1 justify-content-between'>
                        <p className='fs-6 fw-medium'>Spend: Rs. {spend}</p>
                        <p className='fs-6 fw-medium'>Remaining: Rs. {budget-spend}</p>
                    </div>
                    <div className='progress'>
                        <div className='progress-bar progress-bar-striped progress-bar-animated' role="progress-bar" aria-label='Basic Example' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100' style={{ 'width': `${spend/budget*100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BudgetCard