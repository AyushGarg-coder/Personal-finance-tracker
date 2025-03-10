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
    const [budget, setBudget] = useState([])
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setEditState] = useState(false)
    const [index, setIndex] = useState(-1)
    const [newExpense, setNewExpense] = useState({
        id: '',
        name: '',
        amount: '',
        date: '',
        category: '',
    });

    const handleChange = (e) => {
        setNewExpense({
            ...newExpense,
            [e.target.name]: e.target.value
        });
    };

    const handleShow = () => {
        setEditState(false);
        setNewExpense(
            {
                id: '',
                name: '',
                amount: '',
                date: '',
                category: '',
            }
        )
        setShowModal(true)
    };
    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const response = await axios.post('http://localhost:3000/updateExpense', newExpense)
                if (response.status === 200) {
                    expenses[index] = newExpense
                    setEditState(false)
                    setShowModal(false)
                    setIndex(-1)
                    toast.success("Data Updated Successfully")
                }
            }
            else {
                const response = await axios.post('http://localhost:3000/addexpense', newExpense)

                if (response.status === 200) {
                    const data = response.data.insertedExpense;
                    setExpenses([...expenses, data]);
                    handleClose();
                    setNewExpense({ name: '', amount: '', date: '', category: '' });
                } else {
                    alert('Failed to add expense');
                }
            }
        } catch (e) {
            toast.error(e)
        }
    };

    const handleEdit = (data, index) => {
        try {
            setEditState(true);
            setIndex(index)
            setNewExpense(expenses[index])
            setShowModal(true)
        }
        catch (e) {
            toast.error(e)
        }
    }

    const handledelete = async (index, data) => {
        try {
            const response = await axios.post('http://localhost:3000/deleteExpense', { id: expenses[index]._id })
            if (response.status === 200) {
                const updatedExpense = expenses.filter((expense, i) => i != index)
                setExpenses(updatedExpense)
                toast.success("Data Deleted Successfully")
            }
            else {
                toast.error('Data Deletion Failed')
            }
        }
        catch (e) {
            toast.error(e)
        }
    }

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get('http://localhost:3000/expenses')
                if (response.status === 200) {
                    setExpenses(response.data.data)
                    setBudget(response.data.budgets)
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
                <p className="alert alert-warning text-center fw-bold fs-1 font-monospace text-wrap">My Expenses</p>
            </div>
            <div className="mt-2 d-flex flex-row justify-content-end">
                <button className="btn btn-primary" onClick={handleShow}>
                    Add New Expense
                </button>
            </div>

            {/* Modal for Adding New Expense */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Expense' : 'Add New Expense'}</Modal.Title>
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
                                min={1}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={newExpense.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {
                                    budget.map((item, index) => (
                                        <option key={index} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))
                                }

                            </Form.Control>
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
                            {isEditing ? 'Save' : 'Add Expense'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Expenses Table */}
            <div className="mt-2 overflow-x-auto text-break">
                <table className="table table-bordered table-responsive table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Category</th>
                            <th scope="col">Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses && expenses.map((expense, index) => (
                            <tr key={index}>
                                <td>{expense.name}</td>
                                <td>Rs. {expense.amount}</td>
                                <td>{expense.category}</td>
                                <td>{expense.date}</td>
                                <td className='d-flex gap-2'>
                                    <button className='btn btn-warning' onClick={() => handleEdit(expense, index)}>🖍</button>
                                    <button className='btn btn-danger' onClick={() => handledelete(index, expense)}>🗑</button>
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
