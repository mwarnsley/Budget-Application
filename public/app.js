'use strict';
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
    this.percentage = -1;
  };
  // Creating a income constructor for the income objects
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Adding on the calculate percentage function on the Expense prototype
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      // Setting this percentage to the value divided by the total income times 100
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }
  };
  // Adding on the get percentage function to the Expense prototype
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };
  // Creating the function to calculate the total
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
    deleteItem: function(type, id) {
      var ids, index;
      console.log(type, id);
      // Loop through all elements of the income and expenses array
      ids = data.allItems[type].map(function(item) {
        return item.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    calculatePercentages: function() {
      // Looping through the expense array and running the calculate percentage method on it
      data.allItems.exp.forEach(function(item) {
        item.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      var allPerc;
      // Looping through the expense array and running the get percentage method on it
      allPerc = data.allItems.exp.map(function(item) {
        return item.getPercentage();
      });
      return allPerc;
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
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
    inputBtn: '.add__btn',
  };
  var formatNumber = function(num, type) {
    var numSplit, int, dec, sign;
    /*
     * + or - before the number
     * exactly 2 decimal points
     * comma separating the thousands
     * 2310.4567 => + 2,310.46
     */
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // Input 1234, Output 1,234
    }
    dec = numSplit[1];

    sign = type === 'exp' ? '-' : '+';

    return sign + ' ' + int + '.' + dec;
  };
  var nodeListForEach = function(list, callback) {
    var i;
    for (i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with actual data that we receive from obj
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function(selectorID) {
      // Grab the element by ID that we are going to be deleting
      var el = document.getElementById(selectorID);
      // Grab the parent node of the element and delete the child since we can't remove a parent element
      el.parentNode.removeChild(el);
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
      var type;
      obj.budget > 0 ? (type = 'inc') : (type = 'exp');

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    displayPercentages: function(percentages) {
      var fields;

      fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      // Calling the nodlist function that we have created to use
      nodeListForEach(fields, function(item, index) {
        if (percentages[index] > 0) {
          item.textContent = percentages[index] + '%';
        } else {
          item.textContent = '---';
        }
      });
    },
    displayMonth: function() {
      var now, year, month, months;

      // Setting a new date object that we can use
      now = new Date();

      // Setting the array of months
      months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      // Get the current month
      month = now.getMonth();

      // Get the current year
      year = now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },
    changedType: function() {
      var fields;

      fields = document.querySelectorAll(
        DOMstrings.inputType + ', ' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
      );

      nodeListForEach(fields, function(item) {
        item.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },
    getDOMstrings: function() {
      return DOMstrings;
    },
  };
})();

// The Global Controller passing in the Budget and UI Controllers
var controller = (function(budgetCtrl, UICtrl) {
  // Setting up the Event listeners function
  var setupEventListeners = () => {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };
  // Setting up the update budget function
  var updateBudget = function() {
    var budget;
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };
  // Setting up the update percentages function
  var updatePercentages = function() {
    var percentages;

    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };
  // Setting up the function to add an item
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

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };
  // Setting up the function for deleting an item
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    //Get the top parent node of the event target being clicked for deleting
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // Check to make sure that there is an itemID
    if (itemID) {
      // Splitting the itemID and turning it into an array
      splitID = itemID.split('-');

      // The first element of the split array is the type
      type = splitID[0];

      // The second element of the split array is the id
      ID = +splitID[1];

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      UICtrl.displayMonth();
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
