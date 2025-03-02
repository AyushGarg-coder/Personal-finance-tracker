// import { useState } from 'react';
// const Expenses = () => {
//     return (
//         <div className="col">
//             <div className="mt-3 border-bottom border-black">
//                 <p className="alert alert-warning text-center fw-bold fs-1 font-monospace">My Expenses</p>
//             </div>
//             <div className="mt-2 d-flex flex-row justify-content-end">
//                 <button className="btn btn-primary">Add New Expense</button>
//             </div>
//             <div className="mt-2">
//                 <table className="table table-bordered table-responsive table-striped table-hover">
//                     <thead className="table-primary">
//                         <tr>
//                             <th scope="col">Name</th>
//                             <th scope="col">Amount</th>
//                             <th scope="col">Date</th>
//                             <th scope="col">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <th scope="row"></th>
//                             <th scope="row"></th>
//                             <th scope="row"></th>
//                             <th scope="row"></th>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }

// export default Expenses

import { useEffect, useState } from 'react';
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newExpense, setNewExpense] = useState({
        name: '',
        amount: '',
        date: '',
    });

    const handleChange = (e) => {
        setNewExpense({
            ...newExpense,
            [e.target.name]: e.target.value
        });
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Post the new expense data to the backend
        try {
            const response = await axios.post('http://localhost:3000/addexpense', newExpense)

            if (response.status === 200) {
                const data = response.data.insertedExpense;
                console.log(response)
                setExpenses([...expenses, data]); // Add the new expense to the list
                handleClose(); // Close the modal after adding the expense
                setNewExpense({ name: '', amount: '', date: '' }); // Clear the form
            } else {
                alert('Failed to add expense');
            }
        } catch (e) {
            toast.error(e)
        }
    };

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get('http://localhost:3000/expenses')
                if (response.status === 200) {
                    setExpenses(response.data)
                }
            }
            catch (e) {
                toast.error(e)
            }
        }
        fetchExpense()
    }, [])

    return (
        <div className="col">
            <div className="mt-3 border-bottom border-black">
                <p className="alert alert-warning text-center fw-bold fs-1 font-monospace">My Expenses</p>
            </div>
            <div className="mt-2 d-flex flex-row justify-content-end">
                <button className="btn btn-primary" onClick={handleShow}>
                    Add New Expense
                </button>
            </div>

            {/* Modal for Adding New Expense */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Expense Name"
                                name="name"
                                value={newExpense.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                name="amount"
                                value={newExpense.amount}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={newExpense.date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Add Expense
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Expenses Table */}
            <div className="mt-2">
                <table className="table table-bordered table-responsive table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={index}>
                                <td>{expense.name}</td>
                                <td>Rs. {expense.amount}</td>
                                <td>{expense.date}</td>
                                <td>
                                    <button className='btn btn-danger me-2'>🗑</button>
                                    <button className='btn btn-warning ms-2'>🖍</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expenses;
