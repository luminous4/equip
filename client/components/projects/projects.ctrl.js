// angular controller
  // crud functions that will eventually get info from and send to firebase 
  // ng-repeat for each project

  // factory to keep state 

  // may need a form for creating a new project
    // createproject.ctrl.js

(function() {
  var app = angular.module('shoppingList', []);

  app.controller('ProjectController', function() {
    this.catToAdd = "";
    this.addCatToAdd = function() {
      if(this.catToAdd == "") return;
      this.supertypeToAdd.cats.push(this.catToAdd);
      this.catToAdd = "";
    };
    this.removeCatToAdd = function(catToRemove) {
      for(var i = 0; i < this.supertypeToAdd.cats.length; i++){
        if(this.supertypeToAdd.cats[i] == catToRemove && catToRemove !== "All") {
          this.supertypeToAdd.cats.splice(i,1);
          break;
        }
      }
    };
    this.removeCat = function(catToRemove) {
      for(var i = 0; i < this.cats[this.catToEdit].length; i++){
        if(this.cats[this.catToEdit][i] === catToRemove) {
          this.cats[this.catToEdit].splice(i, 1);
        }
      }
    };
    this.addCat = function(){
      if(this.catToAdd == "") return;
      this.cats[this.catToEdit].push(this.catToAdd);
      this.catToAdd = "";
    }

    this.addSuperType = function() {
      if(this.supertypeToAdd.cats.length < 1) return;

      var newCatName = this.supertypeToAdd.name;
      this.catSupertypes.push(newCatName);

      this.alertMessage = "Created new category " + newCatName;

      this.cats[this.supertypeToAdd.name] = this.supertypeToAdd.cats;


      this.supertypeToAdd = {
      name: "",
      cats: ['All']
      };
      this.selectedTab = "All";
      this.alertMessage = "Created new category " + newCatName;
    };
    this.addSupercat = function() {
      this.cats[this.catToEdit] = null;
      for(var i = 0; i < this.catSupertypes.length; i++){
        if(this.cats[this.catToEdit] === this.catSupertypes[i]) {
          this.catSupertypes.splice(i, 1);
        }
      }
    }

    this.catToEdit = "";
    this.editCategory = function(editCategory) {
      this.selectedTab = "Edit Category";
      this.catToEdit = editCategory;
    };

    this.cats = {
      Stores: ["All", "Whole foods", "Ralphs"],
      Aisles: ["All", "Bakery", "Freezer", "Fruits", "Utensils", "Vegetables" ]
    };

    this.selectedTab = "All";
    this.selectedCategory = false;
    this.selectTab = function(newTab) {
      this.selectedTab = newTab;
      this.alertMessage = "";
    };
    this.selectCategory = function(newTab, newCat) {
      this.selectedTab = newTab;
      this.selectedCategory = newCat;
      this.alertMessage = "";
    };
  });

  app.controller('ListController', function() {
    this.products = products;

    this.newProduct = { };

    this.addProduct = function() {
      this.products.push(this.newProduct);
      this.newProduct = { };
    };
    this.removeProduct = function(product) {
      for(var i = 0; i < this.products.length; i++) {
        if(this.products[i] === product) {
          this.products.splice(i, 1);
          break;
        }
      }
    };
  });

  var products = [
    {
      name: 'Rebuild the zoo',
      label: 'Zoo',
      userList: [
        {
          name: 'Giraffe',
          icon: 'img/giraffe.jpg'
        },
        {
          name: "Pig",
          icon: 'img/pig.png'
        },
        {
          name: "Duck",
          icon: "img/duck.jpg"
        }
      ],
      calendarEvents: []
    } 
  ];
})();