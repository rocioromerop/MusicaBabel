$(document).ready(function(){ //Cuando la página se ha cargado por completo

	//Ponemos el foco en el primer input
	$(".auto-focus").focus();

	$("form").on("submit", function(){
		var artist = $.trim($("#artist").val());
		if(artist == ""){
			alert("El artista no puede estar vacío");
			return false;
		}
		var song = $.trim($("#title").val());
		if(song == ""){
			alert("La canción no puede estar vacía");
			return false;
		}

		var url = $.trim($("#song_url").val());

		var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

		if(url == "" && pattern.test(url) == false){
			alert("La url de la canción no es válida");
			return false;
		}

		$.ajax({
			method: 'post',
			url: '/api/songs/',
			data: JSON.stringify({
				artist: artist,
				song: song,
				url: url
			}),
			dataType: 'json',
			contentType: 'application/json',
			success: function(){
				alert("Ha ido bien");
			},
			error: function(){
				alert("Se ha producido un error");
			}

		});

		return false;
	});





});