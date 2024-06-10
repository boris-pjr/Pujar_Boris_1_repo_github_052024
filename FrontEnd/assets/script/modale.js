//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AFFICAHGE DE LA MODALE //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sélectionne l'élément de la modale
var modal = document.getElementById("myModal");

// Sélectionne le bouton pour ouvrir la modale
var btn = document.getElementById("myBtn");

// Sélectionne l'élément pour fermer la modale
var span = document.getElementsByClassName("close")[0];

// Sélectionne l'icône de retour dans la modale
var returnIcon = document.getElementsByClassName("return")[0];

// Sélectionne le bouton pour ajouter une photo
var btnAddPhoto = document.querySelector(".filtermodal");

// Ouvre la modale lorsqu'on clique sur le bouton
btn.onclick = function () {
  modal.style.display = "block";
  document.body.classList.add("modal-open"); 
  fillModalGallery();
  showGalleryView();
};

// Ferme la modale lorsqu'on clique sur (X)
span.onclick = function () {
  modal.style.display = "none";
  document.body.classList.remove("modal-open"); 
};

// Ferme la modale lorsqu'on clique en dehors de celle-ci
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open"); 
    resetImagePreview(); 
  }
};

// Passe à la vue d'ajout de photo lorsqu'on clique sur le bouton "Ajouter une photo"
btnAddPhoto.onclick = function () {
  document.querySelector(".modal-vueGalerie").classList.add("hidden");
  document.querySelector(".modal-vueAjout").classList.remove("hidden");
  returnIcon.style.display = "block";
  resetImagePreview(); 
};

// Retourne à la vue de la galerie lorsqu'on clique sur l'icône de retour
returnIcon.onclick = function () {
  showGalleryView();
  resetImagePreview();
};

// Fonction pour afficher la vue de la galerie et masquer la vue d'ajout de photo
function showGalleryView() {
  document.querySelector(".modal-vueAjout").classList.add("hidden");
  document.querySelector(".modal-vueGalerie").classList.remove("hidden");
  returnIcon.style.display = "none";
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AFFICAHGE DES PROJETS DANS LA GALERIE (MODALE) //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction pour remplir la galerie de la modale avec les projets
function fillModalGallery() {
  const galleryContainer = document.querySelector(".vueGalerie-Content");
  let imagesContainer = galleryContainer.querySelector(".images-container");
  if (!imagesContainer) {
    imagesContainer = document.createElement("div");
    imagesContainer.classList.add("images-container");
    galleryContainer.insertBefore(
      imagesContainer,
      galleryContainer.children[galleryContainer.children.length - 1]
    );
  } else {
    imagesContainer.innerHTML = "";
  }
  allWorks.forEach((work) => {
    const div = createFigureModal(work);
    imagesContainer.appendChild(div);
  });
}

// Fonction pour créer un élément d'un projet dans la modale
function createFigureModal(work) {
  const div = document.createElement("div");
  div.id = "figureModale" + work.id;
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  img.classList.add("work-image");
  div.classList.add("img-wrapper");
  div.appendChild(img);
  const icone = document.createElement("i");
  icone.setAttribute("class", "fa-solid fa-trash-can");
  icone.addEventListener("click", (event) => {
    // Appeler deleteProject en passant l'ID et l'élément du projet
    let valid = confirm("êtes vous sur de vouloir supprimer ce projet");
    if (valid) deleteProject(work.id);
  });
  div.appendChild(icone);
  return div;
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SUPPRESSION DES PROJETS DANS LA GALERIE (MODALE) //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction pour supprimer un projet
function deleteProject(projectId) {
  // Récupère le token d'authentification stocké dans le localStorage
  const token = localStorage.getItem("token");
  // Vérifie si le token est présent
  if (!token) {
    console.error("Token non trouvé.");
    return;
  }
  // Effectue une requête HTTP DELETE pour supprimer le projet spécifié par projectId
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      // Vérifie la réponse du serveur
      if (response.status == 401) {
        alert("veuillez vous authentifier, erreur authentification");
      }
      if (response.status == 500) {
        alert("Une erreur est survenue veuillez contacter l admin");
        throw new Error(`Echec lors de la suppression.`);
      }
      if (response.status == 204) {
        // Supprime l'élément du DOM correspondant au projet supprimé
        document.getElementById("figureModale" + projectId).remove();
        document.getElementById("figure" + projectId).remove();
        allWorks = allWorks.filter((element) => element.id != projectId);
        alert(`Le Projet ${projectId} est supprimé avec succès.`);
      }
    })
    .catch((error) => {
      console.error("Erreur de suppression", error);
    });
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AJOUTER DES PROJETS DANS LA GALERIE (MODALE) //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupération des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Echec du chargement des catégories');
    }
  })
  .then((data) => {
    //allCategories = [...data]; // Remplace les catégories existantes (tous) par les nouvelles 
    fillCategory(data); // Remplissage du menu déroulant
  })

// Fonction pour remplir le menu déroulant des catégories
function fillCategory(categories) {
  const categoryFull = document.getElementById("category"); //Sélection de l'Élément <select>
  categories.forEach((category) => {
    const options = document.createElement("option");
    options.value = category.id;
    options.textContent = category.name;
    categoryFull.appendChild(options); // Ajoute chaque catégorie au menu déroulant
  });
}


// Fonction pour prévisualiser l'image avant l'ajout 
function ImagePreview() {
  const fileInput = document.getElementById("file-upload");
  const imagePreview = document.getElementById("image-preview");
  const removeImage = document.getElementById("remove-image");
  // Ajout d'un Ecouteur d'Evénements sur la sélection d'un Fichier
  fileInput.addEventListener("change", function (event) {
    const [file] = event.target.files;
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result; // Définit la source de l'image prévisualisée
        imagePreview.style.display = "block"; // Affiche l'image prévisualisée
        removeImage.style.display = "block"; // Affiche le bouton pour annuler l'image
        document.querySelector(".upload-container").classList.add("show-preview"); // Ajoute une classe pour afficher l'image
      };
      reader.readAsDataURL(file); // Lit le fichier comme une URL de données
    }
  });
  // Ajout d'un Ecouteur d'Evénements pour annuler l'image preview
  removeImage.addEventListener("click", resetImagePreview);
}


// Fonction pour réinitialiser l'aperçu de l'image 
function resetImagePreview() {
  const fileInput = document.getElementById("file-upload");
  const imagePreview = document.getElementById("image-preview");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category")
  // Réinitialise les différentes valeur
  fileInput.value = ""; 
  imagePreview.src = ""; 
  titleInput.value = "";
  categoryInput.value = "";
  document.querySelector(".upload-container").classList.remove("show-preview"); // Supprime la classe show-preview
}


// Fonction pour la soumission du formulaire
function FormSubmission() {
  document
    .querySelector(".form-add-photo")
    .addEventListener("submit", function (event) {
      event.preventDefault(); 
      const title = document.getElementById("title").value;
      const category = document.getElementById("category").value;
      const imageFile = document.getElementById("file-upload").files[0];
      // Vérifie si tous les champs sont remplis
      if (!title || !category || !imageFile) {
        alert("Veuillez remplir tous les champs.");
        return;
      }
      // Demande confirmation avant d'ajouter le projet
      if (!confirm("Êtes-vous sûr de vouloir ajouter ce projet ?")) {
        alert("Ajout annulé.");
        return;
      }
      // Crée un objet FormData et y ajoute les données du formulaire
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("image", imageFile);
      addProject(formData);
    });
}


// Fonction pour ajouter un projet
function addProject(formData) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token non trouvé.");
    return;
  }
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Envoie les données du formulaire
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error("Veuillez vérifier les données envoyées.");
      } else if (response.status === 401) {
        throw new Error("Veuillez vous authentifier.");
      } else if (response.status === 500) {
        throw new Error("Une erreur interne est survenue.");
      }
    })
    .then((data) => {
      if (data && data.id) {
        allWorks.push(data);
        affichageWorks(allWorks); 
        alert("Le projet a été ajouté avec succès.");
        resetImagePreview();
        showGalleryView()
        fillModalGallery()
      }
    })
    .catch((error) => {
      alert("Erreur lors de l'envoi du projet : " + error);
    });
}

//Exécute les fonctions de l'image preview et de soumission du formulaire
document.addEventListener("DOMContentLoaded", function () {
  ImagePreview();
  FormSubmission();
});
