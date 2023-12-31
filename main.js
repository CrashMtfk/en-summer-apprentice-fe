import { addEvents } from "./src/utils";
import { addOrders } from "./src/ordersUtil";
import { removeLoader, addLoader } from "./src/components/loader";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <div class="wrap">
        <div class="search">
          <input type="text" class="searchTerm" placeholder="What event are you looking for?">
          <button type="submit" class="searchButton">
          <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div class="main-content flex justify-center">
        <div class="api-search">
        </div>
        <div class="events flex items-center justify-center flex-wrap">
        </div>
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    <div class="orders flex flex-wrap justify-center">
    </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  addLoader();

  const searchButton = document.querySelector('.searchButton');
  const searchInput = document.querySelector('.searchTerm');
  
  searchButton.addEventListener('click', () => {
    fetchTicketEvents()
      .then(allEvents => {
        const filteredEvents = allEvents.filter(event => {
          const eventName = event.eventName.toLowerCase();
          return eventName.includes(searchInput.value.toLowerCase());
        });
        addEvents(filteredEvents);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  });

  renderRadioButtonsFilter()
    .then(filterMarkup => {
      const apiSearchNode = document.querySelector('.api-search');
      apiSearchNode.appendChild(filterMarkup);
  });

  const filterSearchButton = document.querySelector('.filter-search-button');

  fetchTicketEvents()
  .then((data) => {
    setTimeout(() => {
      removeLoader();
      toastr.success("Events loaded succesfully!");
    }, 180);
    addEvents(data);
    console.log(data);
  });
}

function renderRadioButtonsFilter(){
  return fetchTicketEvents() // Return the eventPromise here
    .then(events => {
      const filterContainer = document.createElement('div');

      const eventTypes = new Set(events.map(event =>
        `<input type="radio" id="${event.eventTypeName}" value="${event.eventTypeName}" name="eventType"/>
         <label for="${event.eventTypeName}">${event.eventTypeName}</label><br>`
      ));

      const locations = new Set(events.map(event =>
        `<input type="radio" id="${event.venue.venueLocation}" value="${event.venue.venueLocation}" name="eventLocation"/>
         <label for="${event.venue.venueLocation}">${event.venue.venueLocation}</label><br>`
      ));

      const searchButton = document.createElement('button');
      searchButton.classList.add('buy-tickets-button','filter-search-button');
      searchButton.innerText = "Search";

      filterContainer.innerHTML = `
      <div class="text-white">
        <div class="radio-event-type">
          <fieldset>
          <legend>Select event type</legend>
            ${Array.from(eventTypes).join('\n')}
          </fieldset>
        </div>
        <div class="radio-location">
          <fieldset>
            <legend>Select location</legend>
            ${Array.from(locations).join('\n')}
          </fieldset>
        </div>
      </div>
      `;
      filterContainer.appendChild(searchButton);
      searchButton.addEventListener('click', () => {
          const selectedEventType = document.querySelector('input[name="eventType"]:checked').value;
          const selectedLocation = document.querySelector('input[name="eventLocation"]:checked').value;
          fetch(`http://localhost:8080/events?venueLocation=${decodeURIComponent(selectedLocation)}&eventType=${decodeURIComponent(selectedEventType)}`)
            .then(response => response.json())
            .then(data => addEvents(data));
      })
      return filterContainer; // Return the filterContainer DOM node
    })
    .catch(error => {
      console.error('Error rendering radio buttons filter:', error);
    });
}


// WORKSHOP 2
async function fetchTicketEvents(){
  const response = await fetch('http://localhost:8080/all_events');
  const data = await response.json();
  return data;
}
// WORKSHOP 2

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const customerID = 3;
  fetchCustomerOrders(customerID).then((data) => {
    addOrders(data);
  });
}

async function fetchCustomerOrders(customerID){
  const response = await fetch(`http://localhost:8080/orders/${customerID}`);
  const data = await response.json();
  return data;
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
