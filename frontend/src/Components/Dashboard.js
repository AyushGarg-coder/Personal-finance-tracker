import { useEffect, useState } from "react"
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins } from 'chart.js';
import axios from "axios";
import { toast } from "react-toastify";

//Registering the chart
ChartJS.register(CategoryScale, LinearScale, Tooltip, Title, BarElement, Legend)

const Dashboard = () => {
    const[data,setData]=useState([])
    const [expenses,setExpenses]=useState([])
    
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getBudgetDetail')
                const result=await axios.get('http://localhost:3000/expenses')
                if (response.status === 200 && result.status===200) {
                    setData(response.data)
                    setExpenses(result.data)
                }
            }
            catch (e) {
                toast.error(e.message || 'Internal Server Error')
            }
        }
        fetchdata();
    }, [])
    
    // Extracting data from the array of objects
    const category = data.map(item => item.name);
    const budget = data.map(item => item.amount);
    const spend = expenses.map(item => item.amount);
    const icon = data.map(item => item.icon);  
    const budgetsize=data.length

    
    let totalSpend = spend.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
    let totalBudget = budget.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    const chartData = {
        labels: category,
        datasets: [
            {
                label: "Budget",
                data: budget,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Spent',
                data: spend,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="mt-4 ms-2">
            <p className="fw-bold fs-2 mb-0 font-monospace"> Hi, {localStorage.getItem('name')} 👋</p>
            <p className="mt-0 fst-italic text-warning" style={{ 'fontSize': '15px' }}>Let's Manage Your Income</p>
            <div className="mt-4  rounded">
                <p className="ms-2 mt-2 fst-italic mb-0 fw-light">Unlock the power to confidently manage your money and make smarter financial decisions. Whether you're saving for a goal, planning for the future, or simply keeping track of your spending, our platform helps you navigate your financial journey with clarity and ease. Experience peace of mind as you gain a deeper understanding of your finances and feel empowered to make the choices that bring you closer to your aspirations.</p>
                <p className="ms-2 mt-2 fst-italic mt-0 fw-light">Start your journey today and step into a more financially secure tomorrow.</p>
            </div>
            <div className="row mt-4 g-3 flex-wrap">
                <div className="card col-12 col-sm-12 col-md-6 col-lg-3 me-lg-4 p-4 Card">
                    <div className="text-center d-flex flex-row mx-auto" >
                        <div className=" me-3">
                            <p className="fw-medium fs-6 text-dark-emphasis mb-0 font-monospace">Total Budget</p>
                            <p className="fw-bold fs-5 text-dark mt-0">Rs. {totalBudget}</p>
                        </div>
                        <div className="">
                            <p className="fs-1">🧾</p>
                        </div>
                    </div>
                </div>
                <div className="card col-12 col-sm-12 col-md-6 col-lg-3 me-lg-4 p-4 Card">
                    <div className="text-center d-flex flex-row mx-auto" >
                        <div className=" me-3">
                            <p className="fw-medium fs-6 text-dark-emphasis mb-0 font-monospace">Total Spend</p>
                            <p className="fw-bold fs-5 text-dark mt-0">Rs. {totalSpend}</p>
                        </div>
                        <div className="">
                            <p className="fs-1">💸</p>
                        </div>
                    </div>
                </div>
                <div className="card col-12 col-sm-12 col-md-6 col-lg-3 me-lg-4 p-4 Card">
                    <div className="text-center d-flex flex-row mx-auto" >
                        <div className=" me-3">
                            <p className="fw-medium fs-6 text-dark-emphasis mb-0 font-monospace">No. of Budgets</p>
                            <p className="fw-bold fs-5 text-dark mt-0">{budgetsize}</p>
                        </div>
                        <div className="">
                            <p className="fs-1">🔢</p>
                        </div>
                    </div>
                </div>
                <div className="card col-12 col-sm-12 col-md-6 col-lg-3 me-lg-1 p-4 Card">
                    <div className="text-center d-flex flex-row mx-auto" >
                        <div className=" me-3">
                            <p className="fw-medium fs-6 text-dark-emphasis mb-0 font-monospace">Sum of Income Streams</p>
                            <p className="fw-bold fs-5 text-dark mt-0">Rs. 1000</p>
                        </div>
                        <div className="">
                            <p className="fs-1">🧮</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-4 row mb-5 g-3'>
                <div className='col-12 col-md-6 col-lg-7'>
                    <div className="p-3 Card">
                        <p className="font-monospace fs-5 fw-bold">Activity</p>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className='col-12 col-md-6 col-lg-5 border'>
                    <div className="p-3">
                        <p className="fw-bold fs-5 font-monospace">Latest Budgets</p>
                        <div className="row g-3 d-flex flex-row flex-1 justify-content-center overflow-y-scroll" style={{ 'height': '20rem' }}>
                            {
                                category.map((cat, index) => (
                                    <div key={index} className="col-12 card p-3 Card w-75">
                                        <div className="d-flex flex-row flex-1 flex-wrap justify-content-between">
                                            <p className="fs-4">{icon[index]}</p>
                                            <p className="fs-5 fw-bold">{cat}</p>
                                            <p className="fw-bold fs-5 text-success">Rs. {budget[index]}</p>
                                        </div>
                                        <div className="mt-2">
                                            <div className="progress">
                                                <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-label="Basic example" style={{ "width": `${(spend[index] / budget[index]) * 100}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="mt-4 border">
                    <div className="p-3">
                        <p className="fs-5 fw-bold font-monospace">Latest Expense</p>
                        <div className="mt-2">
                            <table className="table table-striped table-hover table-bordered table-responsive">
                                <thead className="table-primary">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Date</th>
                                        {/* <th scope="col">Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {
                                        expenses.map((data, index) => (
                                            <tr key={index}>
                                                <th scope="row">{data.name}</th>
                                                <th>{data.category}</th>
                                                <th>{data.amount}</th>
                                                <th>{data.date}</th>
                                                {/* <th><button className="btn btn-warning">Delete</button></th> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard