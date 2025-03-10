import { useEffect, useState } from "react"
import BudgetCard from "./BudgetCard"
import { toast } from "react-toastify"
import { Button, Form, Modal } from "react-bootstrap"
import axios from "axios"


const Budget = () => {
    const [showModal, setShowModal] = useState(false)
    const [budgetdata, setBudgetData] = useState({
        name: '',
        amount: '',
        icon: '',
        spend: '',
        item_count: '',
    })
    const [budget, setBudget] = useState([])
    const emojis = [
        // Money & Financial
        "💸", "💵", "💴", "💶", "💷", "💰", "💳", "🪙", "🏦", "🏧", "💲", "🏛️", "🛒",

        // Spending & Budgeting
        "💳", "🛍️", "🧾", "💰", "💸", "💵", "💴", "💶", "💷", "📉", "📈", "📊", "💼", "🧾",

        // Income & Earning
        "💼", "💻", "🖥️", "📱", "👩‍💻", "👨‍💻", "🏢", "🏠", "💪", "🧑‍💼", "👨‍💼", "👩‍💼", "💼",

        // Assets & Investments
        "🏠", "🏢", "🏘️", "🏚️", "🏙️", "🏛️", "💎", "📈", "📉", "💹", "📊", "🏦", "🏧", "🪙", "💲",

        // Food & Drink (Expense categories like groceries, dining out, etc.)
        "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥥", "🥝", "🍅", "🍆", "🌶️", "🌽", "🥕", "🥔",
        "🍪", "🍩", "🍰", "🎂", "🍫", "🍬", "🍭", "🍮", "🍺", "🍻", "🍷", "🍾", "🥂", "🍸", "🥃", "🍹", "🍾", "🥤",

        // Travel & Places (For transport or travel-related expenses)
        "🚗", "🛴", "🚌", "🚋", "🚕", "🚖", "🚂", "🚉", "🛩️", "✈️", "🚀", "🛳️", "🚢", "🌍", "🏖️", "🏝️", "🏜️", "🏞️", "🏙️", "🏛️",
        "🗺️", "🌆", "🌍", "🗽", "🌄", "🏙️", "🚠", "🛳️", "🛩️", "🛫", "🏕️", "🏖️",

        // Objects (For everyday items or specific expenses)
        "🛒", "🛍️", "💼", "🔑", "🔒", "🗝️", "💎", "💍", "🔨", "🔧", "🧰", "💻", "🖥️", "📱", "⌚", "🎮", "🎧", "📷", "🎬", "🎧", "💡",
        "🔋", "🔌", "📸", "📺", "📚", "📝", "🖊️", "🖋️", "📓", "📚", "📖"
    ];



    const handleClose = () => {
        setShowModal(false);
    }

    const handleChange = (e) => {
        setBudgetData({ ...budgetdata, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/addBudget', budgetdata);

            if (response.status === 200) {
                const updatedBudgetsResponse = await axios.get('http://localhost:3000/getBudgetDetail');
                if (updatedBudgetsResponse.status === 200) {
                    setBudget(updatedBudgetsResponse.data);
                }
                setBudgetData({ name: '', icon: '', amount: '', spend: '' });
                setShowModal(false);
                toast.success(response.data);
            }
        } catch (e) {
            toast.error(e.message || 'An error occurred while adding the budget');
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getBudgetDetail');
                if (response.status === 200) {
                    setBudget(response.data);
                }
            } catch (e) {
                toast.error(e.message || 'Error fetching budgets');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="">
            <div className="mt-3 border-bottom border-black">
                <p className="alert alert-warning font-monospace fw-bold fs-1 text-center">My Budgets</p>
            </div>
            <div className="mt-4">
                <div className="row g-4">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4" onClick={() => { setShowModal(true) }}>
                        <div className='card Card p-3 bg-success-subtle border-dark' style={{ 'height': '10.5rem' }}>
                            <div className="text-center mt-auto mb-auto" >
                                <p className="fw-medium fs-4">+</p>
                                <p className="fw-medium fs-4">Create New Budget</p>
                            </div>
                        </div>
                    </div>
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{"Add Budget"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Icon</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="icon"
                                        value={budgetdata.icon}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Icon</option>
                                        {emojis.map((emoji, index) => (
                                            <option key={index} value={emoji}>
                                                {emoji}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Budget Name"
                                        name="name"
                                        value={budgetdata.name}
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
                                        value={budgetdata.amount}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Save Budget
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    {
                        budget.map((data, index) => (
                            <BudgetCard key={index} icon={data.icon} budget={data.amount} category={data.name} spend={data.spend} items={data.item_count} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Budget