/**
 * Delivery Scheduler Logic
 * Handles the interactive delivery schedule based on city selection
 */

document.addEventListener('DOMContentLoaded', () => {
    const citySelector = document.getElementById('city-selector');
    const resultsPanel = document.getElementById('delivery-results');

    // Display elements
    const dispatchDayEl = document.getElementById('dispatch-day');
    const routeNameEl = document.getElementById('route-name');
    const leadTimeEl = document.getElementById('lead-time');

    const deliveryData = {
        harare: {
            day: 'Every Weekday (Mon-Fri)',
            route: 'Local Metropolitan Fleet',
            lead: '6-12 Hours'
        },
        bulawayo: {
            day: 'Tuesdays & Thursdays',
            route: 'Southern Distribution Route',
            lead: '24-48 Hours'
        },
        mutare: {
            day: 'Mondays & Wednesdays',
            route: 'Eastern Highlands Route',
            lead: '24 Hours'
        },
        gweru: {
            day: 'Tuesdays & Fridays',
            route: 'Central Corridor Fleet',
            lead: '18-24 Hours'
        },
        masvingo: {
            day: 'Wednesdays only',
            route: 'South-Eastern Loop',
            lead: '48 Hours'
        }
    };

    if (citySelector) {
        citySelector.addEventListener('change', (e) => {
            const city = e.target.value;
            const data = deliveryData[city];

            if (data) {
                // Update text
                dispatchDayEl.innerText = data.day;
                routeNameEl.innerText = data.route;
                leadTimeEl.innerText = data.lead;

                // Show panel with animation
                resultsPanel.classList.remove('opacity-0', 'translate-y-4');
                resultsPanel.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }
});
