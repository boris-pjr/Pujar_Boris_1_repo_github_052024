//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RECUPETATION DES TRAVAUX DEPUIS LE BACK-END //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
