import { useStyle } from "./components/styles";

export const kebabCase = (str) => str.replaceAll('','-');

export const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No invents';
  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach(event => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
};

const createEvent = (eventData) => {
  const eventElement = createEventElement(eventData);
  return eventElement;
};

const createEventElement = (eventData) => {
  const {eventID, venue, eventDescription, eventName, startDate, endDate, ticketCategorySet} = eventData;
  const eventDiv = document.createElement('div');

  const purchaseQuantity = useStyle('purchaseQuantity');
  const quantityElemContainer = useStyle('quantityElementsContainer');
  const quantityButtons = useStyle('quantityButtons');

  eventDiv.classList.add('content', 'm-4', 'p-4', 'rounded-lg', 'grid', 'place-items-center','drop-shadow-xl');
  const formatedPeriod = periodFormat(startDate,endDate);

  const contentMarkup = `
    <div>
      <img src="./src/assets/image-cover.jpg" alt="Event cover image" class="event-image w-80 h-72 rounded object-cover mb-4">
      <header>
        <h2 class="event-title text-2xl font-bold text-center drop-shadow">${eventName}</h2>
      </header>
      <div class="event-details my-4">
        <p class="description text-gray-800">${eventDescription}</p>
        <p class="period text-gray-800 flex"><img src="./src/assets/event_period.svg" class="w-4 mr-2"> ${formatedPeriod}</p>
        <p class="location text-gray-800 flex"><img src="./src/assets/event_location.svg" class="w-4 mr-2"> ${venue.venueLocation}</p>
      </div>
    </div>
  `;
  eventDiv.innerHTML = contentMarkup;

  // Ticket Category

  const actions = document.createElement('div');
  actions.classList.add('m-4')
  
  const categoriesOptions = ticketCategorySet.map(
    (ticketCategory) =>
      `<option value=${ticketCategory.ticketCategoryID}>${ticketCategory.ticketDescription}</option>` 
  );

  const ticketTypeMarkup = `
    <h2>Choose Ticket Type:</h2>
    <select id="ticketType" name="ticketType">
      ${categoriesOptions.join('\n')}
    </select>
  `;
  actions.innerHTML = ticketTypeMarkup;

  // Quantity

  const quantity = document.createElement('div');
  quantity.classList.add(...quantityElemContainer);
  const input = document.createElement('input');
  input.classList.add(...purchaseQuantity);
  input.type ='number';
  input.min = '0';
  input.value = '0';

  input.addEventListener('blur', () => {
    if(!input.value){
      input.value = 0;
    }
  });

  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value);
    if(currentQuantity > 0){
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  quantity.appendChild(input);
  const quantityActions = document.createElement('div');
  
  // Increase button
  const increase = document.createElement('button');
  increase.classList.add(...quantityButtons);
  increase.innerText = '+';
  increase.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
    const currentQuantity = parseInt(input.value);
    if(currentQuantity > 0){
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  const decrease = document.createElement('button');
  decrease.classList.add(...quantityButtons);
  decrease.innerText = '-';
  decrease.addEventListener('click', () => {
    const currentValue = parseInt(input.value);
    if(currentValue > 0){
      input.value = currentValue - 1;
    }
    const currentQuantity = parseInt(input.value);
    if(currentQuantity > 0){
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  });

  quantityActions.appendChild(increase);
  quantityActions.appendChild(decrease);

  quantity.appendChild(quantityActions);
  actions.appendChild(quantity);
  eventDiv.appendChild(actions);

  const eventFooter = document.createElement('footer');
  const addToCart = document.createElement('button');
  addToCart.classList.add('buy-tickets-button');
  addToCart.innerText = 'Add to Cart';
  addToCart.disabled = true;

  addToCart.addEventListener('click', () => {

  });
  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);

  return eventDiv;
}

const periodFormat = (startDate, endDate) =>{
    var trimmedStartDate = startDate.split('T')
    var trimmedEndDate = endDate.split('T')
    var period = trimmedStartDate[0] + '/' + trimmedEndDate[0];
    return period;
};