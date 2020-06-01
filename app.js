var budgetController = (function() {
	
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			// Creating new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Creating the new item
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// Adding the new item to data structure
			data.allItems[type].push(newItem);

			// Returning new item
			return newItem;
		}
	};


})();



var UIController = (function() {
	
	var DOMstrings = {
		inputType: document.querySelector('.add__type'),
		inputDescription: document.querySelector('.add__description'),
		inputValue: document.querySelector('.add__value'),
		inputBtn: document.querySelector('.add__btn')
	
	}

	return {
		getInput: function() {
			return {
				type: DOMstrings.inputType.value,
				description: DOMstrings.inputDescription.value,
				value: DOMstrings.inputValue.value
			};
		},
		getDOMS: function() {
			return DOMstrings;
		}
	};

})();



var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListners = function() {
		var DOMS = UICtrl.getDOMS();	

		DOMS.inputBtn.addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(e) {
		
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});

	};

	var ctrlAddItem = function() {

		// Getting the field input data
		var input = UICtrl.getInput();
		
		// Adding the item to the budget controller
		var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
	};

	return {
		init: function() {
			setupEventListners();
		}
	};

})(budgetController, UIController);


controller.init();