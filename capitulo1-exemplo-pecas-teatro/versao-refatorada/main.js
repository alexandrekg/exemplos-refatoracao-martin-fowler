const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`
    for (let performance of data.performances) {        
        result += ` ${performance.play.name}: ${usd(amountFor(performance))} (${performance.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100);
}



console.log(statement(invoices, plays));