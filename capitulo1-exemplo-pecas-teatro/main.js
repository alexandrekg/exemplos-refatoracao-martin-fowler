const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`
    const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format;
    for (let performance of invoice.performances) {
        const play = plays[performance.playID];
        let thisAmount = 0;

        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (performance.audience > 30) {
                    // exemplo: performance.audience for 50, 1000 * 20 (performance.audience - 30), ou seja, vou somar no thisAmount 40000 + 20000
                    thisAmount += 1000 * (performance.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (performance.audience > 20) {
                    // exemplo: performance.audience for 50, 10000 + (500 * 30) (performance.audience - 20), ou seja, vou somar no thisAmount 30000 + 10000 + 15000
                    thisAmount += 10000 + 500 * (performance.audience - 20);
                }
                thisAmount += 300 * performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        // soma créditos por volume
        volumeCredits += Math.max(performance.audience - 30, 0);
        if ("comedy" === play.type) volumeCredits += Math.floor(performance.audience / 5);

        // exibe a linha para esta requisição
        result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}


console.log(statement(invoices, plays));