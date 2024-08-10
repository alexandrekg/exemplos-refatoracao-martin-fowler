const plays = require('./plays.json');
const invoices = require('./invoices.json');

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
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`
    const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format;
    for (let performance of invoice.performances) {
        let thisAmount = amountFor(performance);
        
        // soma créditos por volume
        volumeCredits += Math.max(performance.audience - 30, 0);
        if ("comedy" === playFor(performance).type) volumeCredits += Math.floor(performance.audience / 5);

        // exibe a linha para esta requisição
        result += ` ${playFor(performance).name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}


console.log(statement(invoices));