class PerformanceCalculator {
    constructor(arrayPerformance, arrayPlay) {
        this.performance = arrayPerformance;
        this.play = arrayPlay;
    }

    getAmount(this) {
        let result = 0;
    
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    // exemplo: this.audience for 50, 1000 * 20 (this.audience - 30), ou seja, vou somar no result 40000 + 20000
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    // exemplo: this.audience for 50, 10000 + (500 * 30) (this.audience - 20), ou seja, vou somar no result 30000 + 10000 + 15000
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.play.type}`);
        }
    
        return result;
    }

    getVolumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
        return result;
    }
}

export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
}

function enrichPerformance(arrayPerformance) {
    const calculator = createPerformanceCalculator(arrayPerformance, playFor(arrayPerformance));
    const result = Object.assign({}, arrayPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
}

function createPerformanceCalculator(arrayPerformance, arrayPlay) {
    return new PerformanceCalculator(arrayPerformance, arrayPlay);
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
}

function playFor(arrayPerformance) {
    return plays[arrayPerformance.playID];
}

function amountFor(arrayPerformance) {
    return new PerformanceCalculator(arrayPerformance, playFor(arrayPerformance)).amount;
}
