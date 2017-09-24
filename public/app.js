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
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
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
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // value is either inc or exp for select
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
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
  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Need to get the field input data
    input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the new item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function() {
      console.log('The Application has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
