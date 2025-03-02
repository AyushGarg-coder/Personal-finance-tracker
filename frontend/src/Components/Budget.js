import { useState } from "react"
import BudgetCard from "./BudgetCard"


const Budget = ({ icon, budget, spend, category }) => {
const [budgetdata,setBudgetData]=useState({
    name:'',
    amount:'',
    icon:''
})

    return (
        <div className="">
            <div className="mt-3 border-bottom border-black">
                <p className="alert alert-warning font-monospace fw-bold fs-1 text-center">My Budgets</p>
            </div>
            <div className="mt-4">
                <div className="row g-4">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div className='card Card p-3 bg-success-subtle border-dark' style={{ 'height': '10.5rem' }}>
                            <div className="text-center mt-auto mb-auto">
                                <p className="fw-medium fs-4">+</p>
                                <p className="fw-medium fs-4">Create New Budget</p>
                            </div>
                        </div>
                    </div>
                    {
                        category.map((cat, index) => (
                            <BudgetCard key={index} icon={icon[index]} budget={budget[index]} category={cat} spend={spend[index]} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Budget