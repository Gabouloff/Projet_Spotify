// Demande de connection au serveur de spotify (client credential flow)
$.ajax(
	{
	  method: "POST",
	  url: "https://accounts.spotify.com/api/token",
	  data: {
		"grant_type":    "client_credentials",
		"client_secret":  "c2b41e21370c4cc39244b5ae8fe3be7e",
		"client_id":     "57cd64960c0a47eaa56cb10a42bc43f4"
	  },
	   function(result) {
		alert("ok");
	  },
	}
  );




// Redirection vers mon profil linked in
$("#linkedIn").on("click", function(){ 
	$(location).attr('href', 'https://www.linkedin.com/in/anthony-gabouloff/')
});


// Redirection vers mon site personnel
$("#sitePersonnel").on("click", function(){ 
	$(location).attr('href', 'http://www.anthony-gabouloff.fr')
});

// // fonction de gestion d'une recherche, retourne le nom d'un artiste
// function nomArtisteViable(nomArtiste){
// 	// La fonction trim va supprimer les espaces avant et apres le texte 
// 	// Ici elle nous permettra d'eviter qu'un utilisateur fasse une recherche ne comprennant que des espaces
// 	if( $.trim(nomArtiste).length === 0)
// 	{
// 		bootbox.prompt("Vous n'avez pas entré de nom d'artiste !", function(result){                
// 			nomArtisteViable(result);
// 			});
// 	}else{
// 		return(nomArtiste);
// 	}
// }

// Gestion du bouton de recherche
$("#btnRecherche").on("click", function(){ 
	// Récupération de la zone texte
	var nomArtiste = $("#inputNomArtiste").val();

	// Vérification que l'input contient bien quelque chose
		// La fonction trim va supprimer les espaces avant et apres le texte 
		// Ici elle nous permettra d'eviter qu'un utilisateur fasse une recherche ne comprennant que des espaces
	if( $.trim(nomArtiste).length === 0)
	{
		// Pas de nom d'artiste, on ouvre un message d'erreur
		bootbox.alert({
			message: '<p class="text-center danger">Vous n\'avez pas entrer de nom d\'artiste !</p>',
		});
	}else{
		// On va pouvoir traiter l'information

		// Demande de connection au serveur de spotify (client credential flow)
		$.ajax({
			method: "GET",
			url: 'https://api.spotify.com/v1/search',
			success : function(data, statut){ 
				alert("OUIIII");
			},
			//headers
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Basic  57cd64960c0a47eaa56cb10a42bc43f4:c2b41e21370c4cc39244b5ae8fe3be7e", "grant_type=client_credentials");
			}
		});
	}
});



// // Exécute un appel AJAX GET
// // Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
// function ajaxGet(url, callback) {
//     var req = new XMLHttpRequest();
//     req.open("GET", url);
//     req.addEventListener("load", function () {
//         if (req.status >= 200 && req.status < 400) {
//             // Appelle la fonction callback en lui passant la réponse de la requête
//             callback(req.responseText);
//         } else {
//             console.error(req.status + " " + req.statusText + " " + url);
//         }
//     });

//     req.addEventListener("error", function () {
//         console.error("Erreur réseau avec l'URL " + url);
//     });

//     req.send(null);
// }

