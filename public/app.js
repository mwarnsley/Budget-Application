// The Budget Controller
const budgetController = (() => {})();

// The UI Controller
const UIController = (() => {
  // Using the dom strings in this object just in case if we change them in the UI to make it easier using DRY code
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addBtn: '.add__btn',
  };
  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // value is either inc or exp for select
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDOMstrings: () => {
      return DOMstrings;
    },
  };
})();

// The Global Controller passing in the Budget and UI Controllers
const controller = ((budgetCtrl, UICtrl) => {
  const DOM = UICtrl.getDOMstrings();
  const ctrlAddItem = () => {
    // 1. Need to get the field input data
    const input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    // 3. Add the new item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', event => {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
