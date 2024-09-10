export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID]
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
}

function volumeCreditsFor(arrayPerformance) {
    let result = 0;
    result += Math.max(arrayPerformance.audience - 30, 0);
    if ("comedy" === arrayPerformance.type) result += Math.floor(arrayPerformance.audience / 5);
    return result;
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