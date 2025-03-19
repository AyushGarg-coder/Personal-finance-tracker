import { useEffect, useState } from "react"
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins, LineElement, PointElement, Filler, ArcElement, scales } from 'chart.js';
import axios from "axios";
import { toast } from "react-toastify";

//Registering the chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    LineElement, PointElement, Filler, plugins, ArcElement)

const Dashboard = () => {
    const [data, setData] = useState([])
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getBudgetDetail')
                const result = await axios.get('http://localhost:3000/expenses')
                if (response.status === 200 && result.status === 200) {

                    setData(response.data)
                    setExpenses(result.data.data)
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
    const spendData = data.map(item => item.spend)
    const spend = expenses.map(item => ({
        category: item.category,
        amount: parseFloat(item.amount),
        date: item.date
    }));
    const icon = data.map(item => item.icon);
    const budgetsize = data.length

    const getMonthlySpend = () => {
        const monthlySpend = {};

        spend.forEach(item => {
            const month = new Date(item.date).toLocaleString('default', { month: 'long' }); // Get month name (e.g., 'January')
            if (monthlySpend[month]) {
                monthlySpend[month] += item.amount;
            } else {
                monthlySpend[month] = item.amount;
            }
        });

        // Sort months by calendar order (January = 1, February = 2, ..., December = 12)
        const sortedMonths = Object.keys(monthlySpend).sort((a, b) => {
            return new Date(`${a} 1, 2020`).getMonth() - new Date(`${b} 1, 2020`).getMonth();
        });

        // Reorganize the data based on sorted months
        const sortedSpendAmounts = sortedMonths.map(month => monthlySpend[month]);

        return { sortedMonths, sortedSpendAmounts };
    };

    const { sortedMonths, sortedSpendAmounts } = getMonthlySpend();


    let totalSpend = spend.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
    let totalBudget = budget.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);

    const aggregatedSpend = category.map(cat => {
        const categoryspend = spend.filter(item => item.category === cat).reduce((acc, currentValue) => acc + currentValue.amount, 0)

        return categoryspend
    })

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    }
    const stackedchartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            }
        }
    };

    const chartBudgetSpend = {
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
                data: spendData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartSpendPerCategory = {
        labels: category,
        datasets: [
            {
                label: 'Spend by Category',
                data: aggregatedSpend,
                backgroundColor: generatebackgroundcolor(category.length),
                borderColor: 'rgba(255, 255, 255, 1)', // White border
                borderWidth: 2
            }
        ]
    }

    function generatebackgroundcolor(numCategories) {
        let backgroundcolor = [];

        for (let i = 0; i < numCategories; i++) {
            backgroundcolor.push(randomColor());
        }
        return backgroundcolor;
    }
    // Function to generate a random color in rgba format
    function randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const a = 0.6;  // Set the alpha value to make the color semi-transparent

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    const lineChartData = {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Monthly Spend',
                data: sortedSpendAmounts, // Spend data for each month
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area color
                fill: true, // To fill the area under the line
                tension: 0.4, // Smooth curve
                borderWidth: 2,
            }
        ]
    }

    return (
        <div className="mt-4 ms-2">
            <p className="fw-bold fs-2 mb-0 font-monospace"> Hi, {localStorage.getItem('name')} 👋</p>
            <p className="mt-0 fst-italic text-warning" style={{ 'fontSize': '15px' }}>Let's Manage Your Income</p>
            <div className="mt-4  rounded">
                <p className="ms-2 mt-2 fst-italic mb-0 fw-light text-justify">Unlock the power to confidently manage your money and make smarter financial decisions. Whether you're saving for a goal, planning for the future, or simply keeping track of your spending, our platform helps you navigate your financial journey with clarity and ease. Experience peace of mind as you gain a deeper understanding of your finances and feel empowered to make the choices that bring you closer to your aspirations.</p>
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
                            <p className="fw-medium fs-6 text-dark-emphasis mb-0 font-monospace">Total Monthly Spend</p>
                            <p className="fw-bold fs-5 text-dark mt-0">Rs. {spendData.reduce((acc, currentValue) => acc + currentValue, 0)}</p>
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
                <div className="card col-12 col-sm-12 col-md-6 col-lg-3 me-lg-4 p-4 Card">
                    <div className="text-center d-flex flex-row mx-auto" >
                        <div className=" me-3">
                            <p className="fw-medium fs-6 text-dark-emphasis mb-0 font-monospace">Total Spend</p>
                            <p className="fw-bold fs-5 text-dark mt-0">Rs. {totalSpend}</p>
                        </div>
                        <div className="">
                            <p className="fs-1">💰</p>
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
                <div className='col-12 col-md-6 col-lg-6'>
                    <div className="p-3 Card">
                        <p className="font-monospace fs-5 fw-bold">Budget vs Spend</p>
                        <Bar data={chartBudgetSpend} options={chartOptions} />
                    </div>
                </div>
                <div className='col-12 col-md-6 col-lg-6'>
                    <div className="p-3 Card">
                        <p className="font-monospace fs-5 fw-bold">Month-wise Expenditure</p>
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>
                <div className='col-12 col-md-6 col-lg-6' >
                    <div className="p-3 Card" style={{ maxHeight: '', overflow: 'hidden' }}>
                        <p className="font-monospace fs-5 fw-bold">Total Expenditure: <span className="text-danger fw-light">Rs.{totalSpend}</span></p>
                        <Pie data={chartSpendPerCategory} options={chartOptions} maxHeight="50%" />
                    </div>
                </div>

                <div className='col-12 col-md-6 col-lg-6 border'>
                    <div className="p-3" style={{ 'height': '8rem' }}>
                        <p className="fw-bold fs-5 font-monospace">Latest Budgets</p>
                        <div className="overflow-y-scroll overflow-x-hidden" style={{ 'height': '600%' }}>
                            <div className="row g-3 d-flex flex-row flex-1 justify-content-center">
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
                                                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning text-black" role="progressbar" aria-label="Basic example" style={{ "width": `${(spendData[index] / budget[index]) * 100 || 0}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{`${((spendData[index] / budget[index]) * 100).toFixed(0)} ` || '0'}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
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
                                <tbody>
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