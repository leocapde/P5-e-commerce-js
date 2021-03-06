// Création des objets pour la méthode POST

let products = new Array();
let contact;

function createContact() {
  contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value
  }
};

// Création de la liste des produits ajoutés au panier

function createShoppingList() {
  fetch(fetchPromise)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const shoppingList = document.getElementById("shopping_list");
      let totalShopping = 0;

      for (let obj of data) {
        for (let key in localStorage) {
          if (obj._id == key) {
            let productQuantity = localStorage.getItem(obj._id);

            // Création de la carte produit

            let newDiv = document.createElement("div");
            newDiv.id = `${obj._id}`;
            newDiv.classList.add(
              "row",
              "m-3",
              "justify-content-center",
              "align-items-center",
            );
            shoppingList.appendChild(newDiv);

            // Ajout du contenu de la carte produit

            document.getElementById(`${obj._id}`).innerHTML = 
            `
            <div class="col-12 col-md-auto">
              <h6 class="mt-3 text-secondary">Quantité :</h6>
              <p>${productQuantity}</p>
            </div>
            <div class="col-12 col-md-6 card shadow p-3 bg-white rounded">
              <div class="row align-items-center">
                <div class="col-7 card-body">    
                  <h5 class="card-title">${obj.name}</h5>
                  <p class="card-text text-success">${euro.format(obj.price / 100)}</p>
                </div>
                <div class="col-5">
                  <img class="card-img-top" src="${obj.imageUrl}" alt="${obj.name}">
                </div>
              </div>
            </div>
            <div class="col-12 col-md-auto">
              <h6 class="mt-3 text-secondary">Prix total :</h6>
              <p class="text-success fw-bold">${euro.format(obj.price / 100 * productQuantity)}</p>
              <button id="trash_${obj._id}" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Retirer du panier"><i class="fas fa-trash-alt"></i></button>
            </div>
            `;

            totalShopping += obj.price * productQuantity;

            // Retirer un  seul produit

            document.getElementById(`trash_${obj._id}`).addEventListener("click", (event) => {
              if (confirm("Êtes-vous sûr de vouloir retirer ce produit du panier?")) {
                localStorage.removeItem(`${obj._id}`);
                location.reload();
              }
            })

            // Ajout de l'_id dans l'objet "products"

            products.push(obj._id);
          } 
        }
      }

      // Vérification si le panier n'est pas vide 
      
      if (!shoppingList.hasChildNodes()) {
        shoppingList.innerHTML = 
        `
        <p class="mt-5 text-center">Votre panier est actuellement vide ...</p>
        `;
      }

      // Affichage du prix total

      document.getElementById("total_shopping").innerHTML = 
      `
      <div class="row mt-5 justify-content-center h5">
        <p class="col-12 col-md-auto text-secondary">Total du panier :</p>
        <p class="col-12 col-md-auto text-success fw-bold font-size-1.5">${euro.format(totalShopping / 100)}</p>
      </div>
      `;
    })
    .catch((error) => {
      console.error(error);
    });
}

createShoppingList();

// Passer au formulaire de commande

const validationButton = document.getElementById("validation");
validationButton.addEventListener('click', (event) => {
  if (localStorage.length == 0) {
    alert("Votre panier est vide ...")
  } else {
    if (confirm("Êtes-vous sûr de vouloir passer la commande ?")) {

      // Crétaion du formulaire de commande 

      document.getElementById("validation_shopping").innerHTML = 
      `
      <h3 class="my-3">Vos informations personnelles</h3>
      <form id="validation_form">
          <div class="mt-3">
              <h6 class="text-secondary mb-0 text-start">
                  <label for="lastName">Nom :</label>
              </h6>
              <input class="w-100" type="text" id="lastName" name="lastName" required>
              <span id="errorLastName"></span>
          </div>
          <div class="mt-3">
              <h6 class="text-secondary mb-0 text-start">
                  <label for="firstName">Prénom :</label>
              </h6>
              <input class="w-100" type="text" id="firstName" name="firstName" required>
          </div>
          <div class="mt-3">
              <h6 class="text-secondary mb-0 text-start">
                  <label for="address">Adresse :</label>
              </h6>
              <input class="w-100" type="text" id="address" name="address" required>
          </div>
          <div class="mt-3">
              <h6 class="text-secondary mb-0 text-start">
                  <label for="city">Ville :</label>
              </h6>
              <input class="w-100" type="text" id="city" name="city" required>
          </div>
          <div class="mt-3">
              <h6 class="text-secondary mb-0 text-start">
                  <label for="email">Email :</label>
              </h6>
              <input class="w-100" type="email" id="email" name="email" required>
          </div>
          <div class="mt-4 mb-3">
              <button id="confirmation" class="btn btn-success" type="submit">Confirmer la commande</button>
          </div>
      </form>
      `;

      // Création de l'objet contact et envoi de la commande 

      const confirmationButton = document.getElementById("validation_form");
      confirmationButton.addEventListener('submit', (event) => {
        event.preventDefault();
        if (validationForm()) {
          if (confirm("Êtes-vous sûr de vouloir valider la commande ?")) {
            createContact();
            sendCommand();
          }
        }
      });
    }
  }
});

// Validation du fomulaire

function validationForm() {
  let validationForm = document.forms["validation_form"];

  if (validationForm["lastName"].value.length <= 2) {
    alert("Le nom doit contenir au moins 3 caractères");
    validationForm["lastName"].focus();
    return false;
  }

  if (validationForm["firstName"].value.length <= 2) {
    alert("Le prénom doit contenir au moins 3 caractères");
    validationForm["firstName"].focus();
    return false;
  }

  if (validationForm["address"].value.length <= 2) {
    alert("L'addresse doit contenir au moins 3 caractères");
    validationForm["address"].focus();
    return false;
  }

  if (validationForm["city"].value.length <= 2) {
    alert("La ville doit contenir au moins 3 caractères");
    validationForm["city"].focus();
    return false;
  }

  return true;
}

// Création de la méthode POST d'envoi de la commande  

function sendCommand() {
  fetch(fetchPost, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contact, products
    })
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    localStorage.setItem("contact", JSON.stringify(contact));
    location.href = `validation.html?orderId=${data.orderId}`;
  })
  .catch((error) => {
    console.error(error);
  });
}

// Vider le panier

const trashButton = document.getElementById("trash");
trashButton.addEventListener('click', (event) => {
  if (confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
    localStorage.clear();
    location.reload();
  }
});