//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RECUPERATION DES TRAVAUX DEPUIS LE BACK-END //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
}

// Fonction pour filtrer les projets par catégorie
function filtrageCategorie(categoryId) {
  let allFigures = document.querySelectorAll(".figure");
  allFigures.forEach((element) => {
    if (element.dataset.idCategory == categoryId || categoryId == 0)
      element.style.display = "block";
    else element.style.display = "none";
  });
}
