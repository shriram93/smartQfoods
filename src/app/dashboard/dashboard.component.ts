import { Component, OnInit } from '@angular/core';
import { SmartqService } from '../services/smartq.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rawMenu = [];
  categories = [];
  menu = {};
  selectedItems = [];
  currentCategory: string;
  filteredStyles = [];
  constructor(private smartQ: SmartqService) {
  }

  ngOnInit() {
    this.smartQ.getMenu().subscribe(
      res => {
        this.rawMenu = res.json();
        this.categories = this.rawMenu.map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.categories.forEach((category) => {
          const categoryMenu = this.rawMenu.filter(item => {
            if (item.category == category) {
              return true;
            }

          });
          this.menu[category] = categoryMenu;
        });
        this.currentCategory = "All";
        this.filteredCategories = this.categories;
      },
      err => {
        console.log(err);
      }
    )
  }
  addQuantity(foodItem) {
    let currentQuantity = this.getQuantity(foodItem);
    if (currentQuantity == 0) {
      this.selectedItems.push({
        name: foodItem.name,
        quantity: 1,
        totalPrice: foodItem.price
      });
    }
    else {
      let index = 0;
      this.selectedItems.some(function (entry, i) {
        if (entry.name == foodItem.name) {
          index = i;
          return true;
        }
      });
      this.selectedItems[index].quantity++;
      this.selectedItems[index].totalPrice = foodItem.price * this.selectedItems[index].quantity;
    }
  }
  removeQuantity(foodItem) {
    let index = 0;
    this.selectedItems.some(function (entry, i) {
      if (entry.name == foodItem.name) {
        index = i;
        return true;
      }
    });
    let currentQuantity = --this.selectedItems[index].quantity;
    if (currentQuantity == 0) {
      this.selectedItems.splice(index, 1);
    }
    else {
      this.selectedItems[index].totalPrice = foodItem.price * currentQuantity;
    }
  }

  getQuantity(foodItem) {
    let currentQuantity = 0;
    this.selectedItems.forEach(item => {
      if (item.name == foodItem.name) {
        currentQuantity = item.quantity;
      }
    });
    return currentQuantity;
  }

  getSelectedItemTotal() {
    let finalPrice = 0;
    this.selectedItems.forEach(item => {
      finalPrice += item.totalPrice;
    });
    return finalPrice;
  }

  clearCart() {
    this.selectedItems = [];
  }

  changeCategory(category) {
    this.currentCategory = category;
    if (this.currentCategory == "All") {
      this.filteredCategories = this.categories;
    }
    else {
      this.filteredCategories = [];
      this.filteredCategories.push(category);
    }
  }

  isItemAvailable(foodItem) {

    let currentTime;
    var d = new Date(),
      h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
      m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    currentTime = h + ':' + m;
    let hours = foodItem.availabletime.split("-");
    const startTime = hours[0];
    const endTime = hours[1];

    if (currentTime >= startTime && currentTime <= endTime)
      return true;
    else
      return false;

  }
}


