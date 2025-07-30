class Calculator {
    constructor(previousOperandElement, currentOperandElement, summaryElement, historyElement, historyView, displayContent) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.summaryElement = summaryElement;
        this.historyElement = historyElement;
        this.historyView = historyView;
        this.displayContent = displayContent;
        this.history = [];
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateSummary('Calculator cleared');
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.updateSummary('History cleared');
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateSummary('Digit deleted');
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateSummary(`Operation ${operation} selected`);
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        const historyItem = {
            expression: `${this.getDisplayNumber(prev)} ${this.operation} ${this.getDisplayNumber(current)}`,
            result: computation
        };
        this.history.unshift(historyItem);
        if (this.history.length > 10) this.history.pop(); // Keep only last 10 items
        
        this.updateHistoryDisplay();
        this.updateSummary(`${prev} ${this.operation} ${current} = ${computation}`);
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    toggleHistory() {
        this.historyView.classList.toggle('active');
        this.displayContent.style.opacity = this.historyView.classList.contains('active') ? '0' : '1';
        this.displayContent.style.pointerEvents = this.historyView.classList.contains('active') ? 'none' : 'all';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    updateSummary(message) {
        this.summaryElement.innerText = message;
        setTimeout(() => {
            if (this.summaryElement.innerText === message) {
                this.summaryElement.innerText = '';
            }
        }, 3000);
    }

    updateHistoryDisplay() {
        this.historyElement.innerHTML = '';
        this.history.forEach(item => {
            const historyItemElement = document.createElement('div');
            historyItemElement.classList.add('history-item');
            historyItemElement.innerHTML = `
                <div class="expression">${item.expression}</div>
                <div class="result">${this.getDisplayNumber(item.result)}</div>
            `;
            
            // Click handler to recall history item
            historyItemElement.addEventListener('click', () => {
                this.currentOperand = item.result.toString();
                this.updateDisplay();
                this.updateSummary(`Recalled: ${item.expression} = ${item.result}`);
                this.toggleHistory(); // Switch back to calculator view
            });
            
            this.historyElement.appendChild(historyItemElement);
        });
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-action="number"]');
const operationButtons = document.querySelectorAll('[data-action="operation"]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const clearHistoryButton = document.querySelector('[data-action="clear-history"]');
const historyToggleButton = document.querySelector('[data-action="toggle-history"]');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');
const summaryElement = document.querySelector('.calculation-summary');
const historyElement = document.querySelector('.history-items');
const historyView = document.querySelector('.history-view');
const displayContent = document.querySelector('.display-content');

// Create calculator
const calculator = new Calculator(
    previousOperandElement, 
    currentOperandElement,
    summaryElement,
    historyElement,
    historyView,
    displayContent
);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

clearHistoryButton.addEventListener('click', () => {
    calculator.clearHistory();
});

historyToggleButton.addEventListener('click', () => {
    calculator.toggleHistory();
});

// Keyboard support
// [Previous code remains the same until the keyboard event listener]

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Prevent default action for all keys we handle
    if ((e.key >= '0' && e.key <= '9') || 
        e.key === '.' || 
        e.key === '+' || 
        e.key === '-' || 
        e.key === '*' || 
        e.key === '/' || 
        e.key === 'Enter' || 
        e.key === '=' || 
        e.key === 'Backspace' || 
        e.key === 'Escape' || 
        e.key.toLowerCase() === 'h') {
        e.preventDefault();
    }

    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation;
        if (e.key === '*') operation = '×';
        else if (e.key === '/') operation = '÷';
        else operation = e.key;
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key.toLowerCase() === 'h') {
        calculator.toggleHistory();
    }
});