const plays = require('./plays.json');
const invoices = require('./invoices.json');

function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of invoices.performances) {
        volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
}

function volumeCreditsFor(arrayPerformance) {
    let result = 0;
    result += Math.max(arrayPerformance.audience - 30, 0);
    if ("comedy" === playFor(arrayPerformance).type) result += Math.floor(arrayPerformance.audience / 5);
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100);
}

function playFor(arrayPerformance) {
    return plays[arrayPerformance.playID];
}

function amountFor(arrayPerformance) {
    let result = 0;

    switch (playFor(arrayPerformance).type) {
        case "tragedy":
            result = 40000;
            if (arrayPerformance.audience > 30) {
                // exemplo: arrayPerformance.audience for 50, 1000 * 20 (arrayPerformance.audience - 30), ou seja, vou somar no result 40000 + 20000
                result += 1000 * (arrayPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (arrayPerformance.audience > 20) {
                // exemplo: arrayPerformance.audience for 50, 10000 + (500 * 30) (arrayPerformance.audience - 20), ou seja, vou somar no result 30000 + 10000 + 15000
                result += 10000 + 500 * (arrayPerformance.audience - 20);
            }
            result += 300 * arrayPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${playFor(arrayPerformance).type}`);
    }

    return result;
}

function statement(invoice) {
    let totalAmount = 0;
    let result = `Statement for ${invoice.customer}\n`
    for (let performance of invoice.performances) {        
        result += ` ${playFor(performance).name}: ${usd(amountFor(performance))} (${performance.audience} seats)\n`;
        totalAmount += amountFor(performance);
    }

    result += `Amount owed is ${usd(totalAmount)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;
}

console.log(statement(invoices));