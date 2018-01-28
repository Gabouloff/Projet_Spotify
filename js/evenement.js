const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '57cd64960c0a47eaa56cb10a42bc43f4';
const redirectUri = 'http://anthony-gabouloff.fr/VisualStudio/index.html';
const scopes = [
  'user-top-read'
];   

const nomItemJetonSessionStorage = 'jeton';

const hash = window.location.hash
	.substring(1)
	.split('&')
	.reduce(function (initial, item) {
	  if (item) {
	    var parts = item.split('=');
	    initial[parts[0]] = decodeURIComponent(parts[1]);
	  }
	  return initial;
	}, {});
	window.location.hash = '';

	token = hash.access_token;
	delay = hash.expires_in; 

if (token){
	setToken(token,delay); 
} else {
	getToken(); 
}


function redirectionToken(){
	window.location = authEndpoint+'?client_id='+clientId+'&redirect_uri='+redirectUri+'&scope='+scopes.join('%20')+'&response_type=token&show_dialog=true';
}

// Nouvelle demande de jeton
function getToken (){
	var now = new Date(); 
	var jeton = window.sessionStorage.getItem(nomItemJetonSessionStorage); 

	if (jeton){
		jetonJSON=JSON.parse(jeton); 
		if (now - (new Date(jetonJSON.date)) > 0){ // le jeton est perimé il faut le redemander
			window.sessionStorage.removeItem(nomItemJetonSessionStorage); 
			redirectionToken(); 
		} else {
			return jetonJSON.token; 
		}
	}else {
		redirectionToken(); 
	}
}

// Un jeton récupéré
function setToken(token, delay){
	var date = new Date();
	date.setTime(date.getTime()+(delay*1000));
	var jeton = {}; 
	jeton.token = token; 
	jeton.date = date.toJSON(); 
	window.sessionStorage.setItem(nomItemJetonSessionStorage, JSON.stringify(jeton)); 
}



// Au clic sur le bouton recherche lancer la fonction
$("#btnRecherche").on("click", function(){   
	recherche();
});

// Touche entrer, lancer la fonction
$('#inputNomArtiste').keypress(function(event){
    var keycode = (event.which);
    if(keycode == '13'){
        recherche();
    }
});


// Fonction de gestion de la recherche
function recherche(){
	var token = getToken(); 
	// Récupération de la zone texte
	var nomArtiste = $("#inputNomArtiste").val();

	// Suppression de la zone d'erreur
	$('#erreurRecherche').html("");

	// Vérification que l'input contient bien quelque chose
		// La fonction trim va supprimer les espaces avant et apres le texte 
		// Ici elle nous permettra d'eviter qu'un utilisateur fasse une recherche ne comprennant que des espaces
	if( $.trim(nomArtiste).length === 0)
	{
		// Pas de nom d'artiste, on ouvre un message d'erreur
		/* Premiere idée, mini modale bootbox
		bootbox.alert({
			message: '<p class="text-center danger">Vous n\'avez pas entré de nom d\'artiste !</p>',
		});*/
		$('#erreurRecherche').html("Vous devez saisir le nom d'un artiste !");
	}else{
		// On va pouvoir traiter l'information

		// Demande de connection au serveur de spotify (client credential flow)
		$.ajax({
			method: "GET",
			url: 'https://api.spotify.com/v1/search',
			data: {
				q: nomArtiste,
				type: 'artist'
			},
			success : function(data, statut){ 
				// Ajout d'une couleur de fond au tableau
				$('#result').css({'background-color': 'rgba(255,255,255,.8)','overflow': 'scroll'});
				var result = data.artists.items;
				var html ='<table class="table table-striped">'; 
				// Variable de gestion des lignes dans le tableau
				var td = 0;
				for (var i=0; i<result.length; i++){
					var indiceDernier=(result[i].images.length - 1); 
					// Certains artistes n'ayant pas d'image je ne les traitent pas 
					if(indiceDernier >= 0)
					{
						switch(td){
							case 0: // Initialisation de la ligne
							html += '<tr>'+
												'<td class="col-4">'+
													'<div class="result-artists" id-artiste="'+result[i].id+'">'+
														'<img src="'+result[i].images[0].url+
															// J'uniformise les pochettes d'albums a une taille de 100 par 100 px
															//	'"  width="'+result[i].images[indiceDernier].width+
															//	'" height="'+result[i].images[indiceDernier].height+'"/>'; 
															'" width = 100px height = 100px "/>'+
														'<p>'+result[i].name+'</p>'+
													'</div>'+
												'</td>';
							td++;
							break;
							case 2: // Terminaison de la ligne	
							html += '<td class="col-4">'+
												'<div class="result-artists" id-artiste="'+result[i].id+'">'+
													'<img src="'+result[i].images[0].url+
														'" width = 100px height = 100px "/>'+
													'<p>'+result[i].name+'</p>'+
												'</div>'+
											'</td>'+
										'</tr>';
							td=0;
							break;
							default: // Remplissage ligne	
							html += '<td class="col-4">'+
												'<div class="result-artists" id-artiste="'+result[i].id+'">'+
													'<img src="'+result[i].images[0].url+
														'" width = 100px height = 100px "/>'+
													'<p>'+result[i].name+'</p>'+
												'</div>'+
											'</td>';
							td++;	
						}
					}
				}
				html+='</table>'
				$("#result").html(html); 
				$(".result-artists").css('cursor', 'pointer'); 
				// Au click on ouvre tout les albums de l'artiste
				$(".result-artists").on("click", function(){
					var id_selection = $(this).attr('id-artiste');
					envoiRequeteAlbums(id_selection); 
				})
			},
			//headers
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + token);
			}
		});
	}
};


function envoiRequeteAlbums (id_selection) {
	var token=getToken();
	$.ajax({
			method: "GET",
			url: 'https://api.spotify.com/v1/artists/'+id_selection+'/albums',
			success : function(data, statut){ 
				var result = data.items; 
				var html ='<table class="table table-striped">'; 
				// Variable de gestion des lignes dans le tableau
				var td = 0;
				for (var i=0; i<result.length; i++){
					var indiceDernier=(result[i].images.length - 1); 
					// Certains albums n'ayant pas d'image je ne les traitent pas 
					if(indiceDernier >= 0)
					{
						switch(td){
							case 0: // Initialisation de la ligne
							html += '<tr>'+
												'<td class="col-4">'+
													'<div class="result-artists" id-artiste="'+result[i].id+'">'+
														'<img src="'+result[i].images[indiceDernier].url+
															// J'uniformise les pochettes d'albums a une taille de 100 par 100 px
															//	'"  width="'+result[i].images[indiceDernier].width+
															//	'" height="'+result[i].images[indiceDernier].height+'"/>'; 
															'" width = 100px height = 100px "/>'+
														'<p>'+result[i].name+'</p>'+
													'</div>'+
												'</td>';
							td++;
							break;
							case 2: // Terminaison de la ligne	
							html += '<td class="col-4">'+
												'<div class="result-artists" id-artiste="'+result[i].id+'">'+
													'<img src="'+result[i].images[indiceDernier].url+
														'" width = 100px height = 100px "/>'+
													'<p>'+result[i].name+'</p>'+
												'</div>'+
											'</td>'+
										'</tr>';
							td=0;
							break;
							default: // Remplissage ligne	
							html += '<td class="col-4">'+
												'<div class="result-artists" id-artiste="'+result[i].id+'">'+
													'<img src="'+result[i].images[indiceDernier].url+
														'" width = 100px height = 100px "/>'+
													'<p>'+result[i].name+'</p>'+
												'</div>'+
											'</td>';
							td++;	
						}
					}
				}
				html+='</table>'
				$("#result").html(html); 
			},
			//headers
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + token);
			}
		});
}