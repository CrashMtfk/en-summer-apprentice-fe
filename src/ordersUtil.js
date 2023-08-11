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
    const {orderedAt, numberOfTickets, totalPrice} = orderData;
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('orderCard')
    const orderedDate = orderedAt.split('T');

    const contentMarkup = `
        <div class="order-details">
                <h2>Number of tickets: ${numberOfTickets}</h2>
                <p>Total price: ${totalPrice}</p>
                <p>Ordered at: ${orderedDate[0]}</p>
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
    actions.appendChild(deleteButton);

    orderDiv.appendChild(actions);
    return orderDiv;
};