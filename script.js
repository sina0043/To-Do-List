(function () {
  "use strict";

  let myBody = document.querySelector('body'),
    addItem = document.querySelector(".addItem"),
    inputAddItem = document.querySelector(".inputAddItem"),
    title = document.querySelector(".title"),
    outPut = document.querySelector(".output");

  myBody.addEventListener("DOMContentLoaded", storageCheck());
  addItem.addEventListener("click", addItems);

  function addItems() {
    if (inputAddItem.value == "") {
      title.innerText = "Please add an item";
    } else {
      if (outPut.childElementCount == 0) {
        title.innerText = "";
        outPut.innerHTML = `
          <input type="text" class="mt-3 form-control filter" placeholder="Filter Items">
          <div class="items">
            <p class="Item form-control mt-3">${inputAddItem.value}<i class="fa fa-remove text-danger float-right mt-1"></i></p>
          </div>
          <button class="clearAll btn btn-block btn-danger mt-3">Clear All</button>
        `;
        document.querySelector(".fa-remove").style.cursor = 'pointer'
        inputAddItem.value = "";
        remove_upgrade();
        storageItems();
      } else {
        let Items = document.querySelector(".items"),
          Item = document.querySelectorAll(".Item"),
          check = "ok";

        Item.forEach((elementCheck) => {
          if (inputAddItem.value == elementCheck.innerText) {
            check = "";
            title.innerText = "That item already exists!";
          }
        });

        if (!addItem.classList.contains("upgrade") && check == "ok") {
          title.innerText = "";

          Items.innerHTML += `
            <p class="Item form-control mt-3">${inputAddItem.value}<i class="fa fa-remove text-danger float-right mt-1"></i></p>
          `;

          inputAddItem.value = "";
          remove_upgrade();
          storageItems();
        }
        filter();
      }
    }
  }

  function remove_upgrade() {
    let Item = document.querySelectorAll(".Item"),
      clear = document.querySelector(".clearAll");
    Item.forEach((element) => {
      element.addEventListener("click", (e) => {
        Item.forEach((el) => {
          el.classList.remove("edit");
        });
        if (e.target.nodeName == "P") {
          addItem.innerHTML = `<i class="fa fa-pencil"></i>  Update Item`;
          addItem.classList.replace("btn-dark", "btn-success");
          addItem.classList.add("upgrade");
          inputAddItem.value = element.innerText;
          e.target.classList.add("edit");
          e.target.addEventListener('dblclick' , ()=>{
            e.target.classList.remove("edit");
            btnStyle();
            inputAddItem.value = "";
          })
          let Upgrade = document.querySelector(".upgrade");
          Upgrade.addEventListener("click", () => {
            btnStyle()
            if (e.target.classList.contains("edit")) {
              e.target.innerHTML = `${inputAddItem.value} <i class="fa fa-remove text-danger float-right mt-1"></i>`;
              e.target.classList.remove("edit");
            }
            setTimeout(() => {
              inputAddItem.value = "";
            }, 100);
          });
        }

        if (e.target.nodeName == "I") {
          btnStyle();
          inputAddItem.value = "";
          e.target.closest(".Item").remove();
          storageItems()
          if (document.querySelectorAll(".Item").length == 0) {
            outPut.innerHTML = ``;
            localStorage.clear();
          }
        }
      });
    });

    clear.addEventListener("click", () => {
      outPut.innerHTML = ``;
      title.innerText = "";
      btnStyle();
      inputAddItem.value = "";
      localStorage.clear(); 
    });
  }

  function filter() {
    let Item = document.querySelectorAll(".Item"),
    filter = document.querySelector(".filter");

    Item.forEach((e) => {
      filter.addEventListener('input' ,()=>{
        if(e.innerText.toLowerCase().includes(filter.value.toLowerCase())) {
          e.style.display = 'block';
        }else {
          e.style.display = 'none';
        }
      });
    })
  }

  function storageItems() {
    let Item = document.querySelectorAll(".Item"),
    arr = [];

    arr.splice(0, arr.length);
    Item.forEach((e) => {
      arr.push(e.innerText)
    })

    localStorage.setItem('Items',`${arr}`)
  }

  function storageCheck() {
    if(localStorage.getItem('Items') != null) {
      outPut.innerHTML = `
        <input type="text" class="mt-3 form-control filter" placeholder="Filter Items">
        <div class="items"></div>
        <button class="clearAll btn btn-block btn-danger mt-3">Clear All</button>
      `;
      
      let text = localStorage.getItem('Items').split(','),
        Items = document.querySelector('.items');
        
      text.forEach(e =>{
        Items.innerHTML += `<p class="Item form-control mt-3">${e}<i class="fa fa-remove text-danger float-right mt-1"></i></p>`
      })

      remove_upgrade();
      filter();
    }
  }

  function btnStyle() {
    addItem.innerText = "+ Add Item";
    addItem.classList.replace("btn-success", "btn-dark");
    addItem.classList.remove("upgrade");
  }

})();
