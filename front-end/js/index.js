// Récupéreation des données

const fetchPromise = fetch("http://localhost:3000/api/teddies");

// Fonction de création des cartes produits

function createProductCard(data) {
  for (let i in data) {

    // Création d'une carte produit

    let newDiv = document.createElement("div");
    newDiv.id = "product_" + [i];
    newDiv.classList.add(
      "col-12",
      "col-xl-6",
      "shadow",
      "p-3",
      "mb-3",
      "bg-white",
      "rounded"
    );
    document.getElementById("product_list").appendChild(newDiv);

    // Ajout du contenu de la carte produit

    document.getElementById("product_" + [i]).innerHTML = 
      `
      <div class="row">
        <div class="col-7 card-body">    
          <h5 class="card-title">${data[i].name}</h5>
          <p class="card-text text-success">${data[i].price / 100} €</p>
          <a class="btn btn-light" href="product.html?id=${data[i]._id}" class="streched-link" >En savoir plus</a>
        </div>
        <div class="col-5">
          <img class="card-img-top" src="${data[i].imageUrl}">
        </div>
      </div>
      `;
  }
}

// Fonction de création de la liste des produits

function createProductList() {
  fetchPromise
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      createProductCard(data);
    })
    .catch((err) => {
      console.log("Erreur fonction creatProductList()");
    });
}

createProductList();