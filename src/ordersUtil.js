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
    const {orderID,orderTicketCategoryID,orderedAt, numberOfTickets, totalPrice} = orderData;
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
    editButton.classList.add('edit-order');
    editButton.innerText = "Edit";
    editButton.addEventListener('click', () => {
        updateOrderHandler(orderID, orderTicketCategoryID);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-order');
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', () => {
        deleteOrderHandler(orderID);
    });

    const actions = document.createElement('div');
    actions.classList.add('order-actions')
    actions.appendChild(editButton);
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

const updateOrderHandler = (orderID, orderTicketCategoryID) => {
    const buttonsDiv = document.querySelector(`.order-${orderID} .order-actions`);
    const editButton = document.querySelector(`.order-${orderID} .order-actions .edit-order`);
    const deleteButton = document.querySelector(`.order-${orderID} .order-actions .delete-order`);
    const orderCard = document.querySelector(`.order-${orderID}`);

    const editDetails = document.createElement('div');
    editDetails.innerHTML = editOrderMarkup(orderID);
    orderCard.insertBefore(editDetails, buttonsDiv);

    document.querySelector(`.order-${orderID} .order-details`).setAttribute("hidden","");

    buttonsDiv.removeChild(editButton);
    buttonsDiv.removeChild(deleteButton);

    const confirmUpdatesButton = document.createElement('button');
    confirmUpdatesButton.innerText = "Confirm";
    confirmUpdatesButton.addEventListener('click', () => {
        const numberOfTickets = document.getElementById(`number-of-tickets-${orderID}`).value;
        fetch(`http://localhost:5196/api/Order/UpdateOrder/${orderID}/${numberOfTickets}/${orderTicketCategoryID}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                orderId:orderID,
                numberOfTickets: numberOfTickets,
                ticketCategoryID: orderTicketCategoryID
            }),
        }).
        then((res) => {
            if(!res.ok){
                return res.json();
            }
            buttonsDiv.removeChild(confirmUpdatesButton);
            buttonsDiv.removeChild(cancelUpdatesButton);
            orderCard.removeChild(editDetails);
            document.querySelector(`.order-${orderID} .order-details`).removeAttribute("hidden");

            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(deleteButton);
            return res.json();
        })
        .catch(err => 
            {throw new Error(err)
        });
    });

    const cancelUpdatesButton = document.createElement('button');
    cancelUpdatesButton.innerText = "Cancel";
    cancelUpdatesButton.addEventListener('click', () => {
        buttonsDiv.removeChild(confirmUpdatesButton);
        buttonsDiv.removeChild(cancelUpdatesButton);
        orderCard.removeChild(editDetails);
        document.querySelector(`.order-${orderID} .order-details`).removeAttribute("hidden");

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
    });

    buttonsDiv.appendChild(confirmUpdatesButton);
    buttonsDiv.appendChild(cancelUpdatesButton);
}

function editOrderMarkup(orderID){
    return `
        <div class="flex flex-col justify-center items-center m-4">
            <label for="number-of-tickets" class="text-white text-center text-xl font-bold">Number of tickets:</label>
            <input type='number' id='number-of-tickets-${orderID}' name='number-of-tickets' class="update-input"/>
        </div>
    `;
}