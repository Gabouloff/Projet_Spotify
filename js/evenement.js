
// Redirection vers mon profil linked in
$("#linkedIn").on("click", function(){ 
	$(location).attr('href', 'https://www.linkedin.com/in/anthony-gabouloff/')
});


// Redirection vers mon site personnel
$("#sitePersonnel").on("click", function(){ 
	$(location).attr('href', 'http://www.anthony-gabouloff.fr')
});

// Gestion du bouton de recherche
$("#btnRecherche").on("click", function(){ 
    alert("oui");
});