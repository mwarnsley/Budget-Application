/*
 * This is the controllers file that adds the controllers being used based on the Modular Pattern
 * budgetController handles all of the actions pertaining to the budget of the app
 * UIController handles all of the actions that pertain to the UI part of the app
 * controller itself is the global controller that used the UIController and the budgetController as a whole
 */

// The Budget Controller
var budgetController = (function() {
  // Creating a expense constructor for the expense objects
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Creating a income constructor for the income objects
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function(type) {
    var sum = 0;

    // Looping through all of the items and adding up the values
    data.allItems[type].forEach(function(item) {
      sum = sum + item.value;
    });
    // Setting the totals to the sums that have been calculated
    data.totals[type] = sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create a new ID
      ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

      // Create new item based on 'inc' or 'exp' type
      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }

      // Push it int the data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },
    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function() {
      // NEED TO DELETE BEFORE PRODUCTION
      console.log(data);
      alert('MAKE SURE TO DELETE');
    },
  };
})();

// The UI Controller
var UIController = (function() {
  // Using the dom strings in this object just in case if we change them in the UI to make it easier using DRY code
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // value is either inc or exp for select
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: +document.querySelector(DOMstrings.inputValue).value,
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with actual data that we receive from obj
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      // Loop through the fields and clear the fields
      fieldsArr.forEach(function(field) {
        field.value = '';
      });

      // Set the focus back to the description input
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    getDOMstrings: function() {
      return DOMstrings;
    },
  };
})();

// The Global Controller passing in the Budget and UI Controllers
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = () => {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };
  var updateBudget = function() {
    var budget;
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };
  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Need to get the field input data
    input = UICtrl.getInput();

    if (input.description && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the new item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      budgetCtrl.testing();
      // 5. Calculate and update the budget
      updateBudget();
    }
  };

  return {
    init: function() {
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
