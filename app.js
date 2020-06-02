var budgetController = (function() {
	
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPrecentage = function(totalIncome) {

		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome)*100);
		} else {
			this.percentage = -1;
		}

	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});

		data.totals[type] = sum;
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percentage: -1
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
		},

		deleteItem: function(type, id) {
			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calcBudget: function() {

			// Calculate total income and expenses
			calculateTotal('inc');
			calculateTotal('exp');

			// Calculate the budget
			data.budget = data.totals.inc - data.totals.exp;

			// Calculate the percentage
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		calcPercentages: function() {
			
			data.allItems.exp.forEach(function(cur) {
				cur.calcPrecentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},
		
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		}
	};


})();



var UIController = (function() {
	
	var DOMstrings = {
		inputType: document.querySelector('.add__type'),
		inputDescription: document.querySelector('.add__description'),
		inputValue: document.querySelector('.add__value'),
		inputBtn: document.querySelector('.add__btn'),
		expenseContainer: document.querySelector('.expenses__list'),
		incomeContainer: document.querySelector('.income__list'), 
		budgetLabel: document.querySelector('.budget__value'),
		incomeLabel: document.querySelector('.budget__income--value'),
		expensesLabel: document.querySelector('.budget__expenses--value'),
		percentageLabel: document.querySelector('.budget__expenses--percentage'),
		container: document.querySelector('.container'),
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(number, type) {
			var numSplit, int, split;

			number = Math.abs(number);
			number = number.toFixed(2);


			numSplit = number.split('.');
			
			int = numSplit[0];
			dec = numSplit[1];
			
			if (int.length > 3) {
				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,3); 
			}

			return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

	};

	var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};

	return {
		getInput: function() {
			return {
				type: DOMstrings.inputType.value,
				description: DOMstrings.inputDescription.value,
				value: parseFloat(DOMstrings.inputValue.value)
			};
		},
		
		addListItem: function(obj, type) {
			var html, newHtml, element;
			// Creating HTML string

			if (type === 'exp') {
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			
			} else if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			// Replace placeholders
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// Insert into HTML
			element.insertAdjacentHTML('beforeend', newHtml);
			
			
		},

		deleteListItem: function(selectorID) {
			var parent, element;
			
			element = document.getElementById(selectorID);
			parent = document.getElementById(selectorID).parentNode;

			parent.removeChild(element);

		},

		clearFields: function() {
			DOMstrings.inputDescription.value = "";
			DOMstrings.inputValue.value = "";
			DOMstrings.inputDescription.focus();
			
		},

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			DOMstrings.budgetLabel.textContent = formatNumber(obj.budget, type);
			DOMstrings.incomeLabel.textContent = formatNumber(obj.totalInc, 'inc');
			DOMstrings.expensesLabel.textContent = formatNumber(obj.totalExp, 'exp');
			
			console.log(obj.percentage)

			if (obj.percentage > 0) {
				DOMstrings.percentageLabel.textContent = obj.percentage + '%';
			} else {
				DOMstrings.percentageLabel.textContent = '---';
			}
		},

		displayPercentages: function(percentages) {
			
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});

		},

		formatNumber: function(number, type) {
			var numSplit, int, split;

			number = Math.abs(number);
			number = number.toFixed(2);


			numSplit = number.split('.');
			
			int = numSplit[0];
			dec = numSplit[1];
			
			if (int.length > 3) {
				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,3); 
			}

			return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

		}, 

		displayMonth: function() {
			var now, year, month, months;
			
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'December'];

			now = new Date();
			year = now.getFullYear(); 
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

		},

		changedType: function() {
			
			var fields = document.querySelectorAll('.add__type,.add__description,.add__value');

			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});

			DOMstrings.inputBtn.classList.toggle('red');
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

		DOMS.container.addEventListener('click', ctrlDeleteItem);

		DOMS.inputType.addEventListener('change', UICtrl.changedType);

	};

	var updateBudget = function() {
		// Calculate the budget
		budgetCtrl.calcBudget();

		// Return the budget
		var budget = budgetCtrl.getBudget();
		
		// Displaying Budget
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {
		
		// Calculate Precentages
		budgetCtrl.calcPercentages();
		// Read precentages
		var percentages = budgetCtrl.getPercentages();
		console.log(percentages)
		// Update 
		UICtrl.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {

		// Getting the field input data
		var input = UICtrl.getInput();
		
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// Adding the item to the budget controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
	
			// Adding the item to the UI
			UICtrl.addListItem(newItem, input.type);
		
			// Clearing the feilds
			UICtrl.clearFields();

			// Calculate and update Budget
			updateBudget();

			// Calculate and update percentages
			updatePercentages();

		};
		

	};

	var ctrlDeleteItem = function(e){
		var itemID, type, ID;

		itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// Delete item from budget
			budgetCtrl.deleteItem(type, ID);

			// Delete item from UI
			UICtrl.deleteListItem(itemID);

			// Calculate and update Budget
			updateBudget();

			// Calculate and update precentages
			updatePercentages();
			
		}
	};

	return {
		init: function() {
			setupEventListners();
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: 0
			});

		}
	};

})(budgetController, UIController);


controller.init();