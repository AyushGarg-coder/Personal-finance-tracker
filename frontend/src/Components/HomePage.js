import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { toast, ToastContainer } from 'react-toastify';
import Budget from './Budget';
import Expenses from './Expenses';
import axios from 'axios';

const HomePage = () => {
    const [page, setPage] = useState('Dashboard')
    const [data, setData] = useState([])
    
    useEffect(()=>{
        const fetchdata=async()=>{
            try{
                const response=await axios.get('http://localhost:3000/getBudgetDetail')
                if(response.status===200){
                    setData(response.data)
                }
            }
            catch(e){
                toast.error(e.message||'Internal Server Error')
            }
        }
        fetchdata();
    },[])

    // Extracting data from the array of objects
    const category = data.map(item => item.name);
    const budget = data.map(item => item.amount);
    const spend = data.map(item => item.spendamt);
    const icon = data.map(item => item.icon);
    const item=data.map(item=>item.items);

    const handleLogout = () => {
        try {
            localStorage.removeItem('email')
            localStorage.removeItem('name')
            localStorage.removeItem('token')
            window.location.reload()
        }
        catch (e) {
            toast.error(e);
        }
    }

    return (
        <div className="container-fluid border mt-0">
            <ToastContainer />
            <div className="row flex-wrap">
                <div className="col-12 col-sm-4 col-md-3 col-lg-2 border">
                    <div className="container mt-4 d-flex justify-content-center align-items-center">
                        <div className="row g-0">
                            <img src="https://cdn-icons-png.flaticon.com/128/6054/6054322.png" alt="logo" className="col-3 p-2" />
                            <p className="col-7 mt-auto mb-auto fs-5 fw-bold text-success font">MoneyMind</p>
                        </div>
                    </div>
                    <div className="container-fluid d-flex flex-1 flex-column mt-4 justify-content-center">
                        <button className="btn btn-outline-dark mb-3 fw-medium fs-6 rounded-4 p-3 " onClick={() => { setPage('Dashboard') }}><i className="fas fa-tachometer-alt me-2" aria-hidden="true"></i>Dashboard</button>
                        <button className="btn btn-outline-dark mb-3 fw-medium fs-6 rounded-4 p-3 " onClick={() => { setPage('Incomes') }}><i className="fas fa-wallet me-2" aria-hidden="true"></i>Incomes&nbsp;&nbsp;&nbsp;</button>
                        <button className="btn btn-outline-dark mb-3 fw-medium fs-6 rounded-4 p-3 " onClick={() => { setPage('Budgets') }}><i className="fas fa-piggy-bank me-2" aria-hidden='true'></i>Budgets&nbsp;&nbsp;&nbsp;</button>
                        <button className="btn btn-outline-dark mb-3 fw-medium fs-6 rounded-4 p-3 " onClick={() => { setPage('Expenses') }}><i className="fas fa-credit-card me-2" aria-hidden='true'></i>Expenses&nbsp;&nbsp;&nbsp;</button>
                        <button className="btn btn-outline-dark mb-3 fw-medium fs-6 rounded-4 p-3 " onClick={() => { setPage('Profile') }}><i className="fa-solid fa-user me-2" aria-hidden='true'></i>Profile&nbsp;&nbsp;&nbsp;</button>
                        <button className="btn btn-outline-dark mb-5 fw-medium fs-6 rounded-4 p-3 " onClick={handleLogout}><i className="fas fa-sign-out-alt me-2" aria-hidden='true'></i>Logout&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                    </div>
                </div>
                <div className="col-12 col-sm-8 col-md-9 col-lg-10 border">
                    {
                        page === 'Dashboard' ?
                            <Dashboard/>
                            :
                            page === 'Budgets' ?
                                <Budget />
                                :
                                page === 'Expenses' ?
                                    <Expenses categories={category}/>
                                    :
                                    <div className='d-flex justify-content-center align-items-center min-vh-100'>
                                        <p className='text-danger'>"Great things are on the way! Stay tuned, this feature is coming soon to help you manage your finances even better."</p>
                                    </div>

                    }
                </div>
            </div>
        </div>
    )
}

export default HomePage