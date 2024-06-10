//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RECUPETATION DES TRAVAUX DEPUIS LE BACK-END //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Déclaration des tableaux pour stocker les travaux et les catégories
let allWorks = [];
let allCategories = [{ id: 0, name: "Tous" }];
// Récupération des travaux depuis l'API
fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (response.status === 200) {
      console.log(response);
      return response.json();
    }
  })

  .then((data) => {
    if (data) {
      allWorks = data;
      affichageWorks(data);
      console.log(data);
    }
  });

// Fonction pour afficher les travaux dans la galerie
function affichageWorks(works) {
  const galerie = document.querySelector(".gallery");
  galerie.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    const projet = works[i];
    const figureElement = creationProjet(projet);
    galerie.appendChild(figureElement);
  }
}

// Fonction pour créer un élément de projet
function creationProjet(projet) {
  const figureElement = document.createElement("figure");
  figureElement.id = "figure" + projet.id;
  figureElement.dataset.idCategory = projet.categoryId;
  figureElement.classList.add("figure");
  const imageElement = document.createElement("img");
  const titleElement = document.createElement("figcaption");
  imageElement.src = projet.imageUrl;
  titleElement.innerText = projet.title;
  figureElement.appendChild(imageElement);
  figureElement.appendChild(titleElement);
  return figureElement;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REALISATION DES FILTRES DES TRAVAUX : AFFICHAGE PAR CATEGORIE //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupération des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (response.status === 200) {
      console.log(response);
      return response.json();
    }
  })

  .then((data) => {
    if (data) {
      data.forEach((element) => {
        allCategories.push(element);
      });
      console.log(allCategories);
      affichageCategories(allCategories);
    }
  });

// Fonction pour afficher les catégories sous forme de boutons de filtre
function affichageCategories(categories) {
  const filtresCategories = document.querySelector(".filtres");
  categories.forEach((uniqueCategorie) => {
    const boutonCategorie = document.createElement("button");
    boutonCategorie.id = uniqueCategorie.id;
    boutonCategorie.textContent = uniqueCategorie.name;
    boutonCategorie.className = "filter";
    boutonCategorie.addEventListener("click", () =>
      filtrageCategorie(uniqueCategorie.id)
    );
    filtresCategories.appendChild(boutonCategorie);
  });

  document.getElementById("0").classList.add("active");
}

// Fonction pour filtrer les projets par catégorie
function filtrageCategorie(categoryId) {
  let allFigures = document.querySelectorAll(".figure");
  allFigures.forEach((element) => {
    if (element.dataset.idCategory == categoryId || categoryId == 0)
      element.style.display = "block";
    else element.style.display = "none";
  });
  // Ajout de la classe active au bouton "Tous" ou au bouton correspondant
  let allButtons = document.querySelectorAll(".filter");
  allButtons.forEach((button) => {
    if (button.id == categoryId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTHENTIFICATION DE L'UTILISATEUR //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Vérifie si l'utilisateur est authentifié
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token !== null;
}

// Déconnexion de l'utilisateur
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.href = "./index.html";
}

// Configuration des éléments en fonction de l'authentification de l'utilisateur
document.addEventListener("DOMContentLoaded", function () {
  const filtresDiv = document.querySelector(".filtres");
  const loginLink = document.querySelector(".login");
  const barreN = document.querySelector(".barreN");
  const logoutLink = document.getElementById("logoutLink");
  const modifier = document.querySelector(".projetModifier");
  if (isAuthenticated()) {
    // Si l'utilisateur est authentifié
    if (filtresDiv) filtresDiv.classList.add("hidden");
    if (loginLink) loginLink.classList.add("hidden");
    if (barreN) barreN.classList.remove("hidden");
    if (logoutLink) logoutLink.classList.remove("hidden");
    if (modifier) modifier.classList.remove("hidden");
  } else {
    // Si l'utilisateur n'est pas authentifié
    if (filtresDiv) filtresDiv.classList.remove("hidden");
    if (loginLink) loginLink.classList.remove("hidden");
    if (barreN) barreN.classList.add("hidden");
    if (logoutLink) logoutLink.classList.add("hidden");
    if (modifier) modifier.classList.add("hidden");
  }
  if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      logout();
    });
  }
});


