const plays = require('./plays.json');
const invoices = require('./invoices.json');



function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100);
}



console.log(statement(invoices, plays));