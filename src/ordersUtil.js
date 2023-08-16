export const addOrders = (orders) => {
    const ordersDiv = document.querySelector('.orders');
    ordersDiv.innerHTML = 'No orders';
    if(orders.length){
        ordersDiv.innerHTML = '';
        orders.forEach(order => {
            ordersDiv.appendChild(createOrder(order));
        });
    }
};

const createOrder = (orderData) => {
    const orderElement = createOrderElement(orderData);
    return orderElement
};

const createOrderElement = (orderData) => {
    const {orderID,orderedAt, numberOfTickets, totalPrice} = orderData;
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('orderCard',`order-${orderID}`);
    const orderedDate = orderedAt.split('T');

    const contentMarkup = `
        <div class="order-details">
                <h2>Number of tickets: <span>${numberOfTickets}</span></h2>
                <p>Total price: <span>${totalPrice}</span></p>
                <p>Ordered at: <span>${orderedDate[0]}</span></p>
        </div>
    `;
    orderDiv.innerHTML = contentMarkup;
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    editButton.innerText = "Edit";
    deleteButton.innerText = "Delete";

    const actions = document.createElement('div');
    actions.classList.add('order-actions')
    actions.appendChild(editButton);

    deleteButton.addEventListener('click', () => {
        deleteOrderHandler(orderID);
    });
    actions.appendChild(deleteButton);

    orderDiv.appendChild(actions);
    return orderDiv;
};

const deleteOrderHandler = (orderID) => {
    fetch(`http://localhost:5196/api/Order/DeleteOrder/${orderID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
        }
    })
    .then(res => {
        if(!res.ok){
            return res.json();
        }
        const orderToBeRemoved = document.querySelector(`.order-${orderID}`);
        if (orderToBeRemoved) {
            orderToBeRemoved.remove();
            toastr.success("Success delete");
        } else {
            console.log("Order element not found.");
        }
    })
    .catch(err => console.log(err));
}