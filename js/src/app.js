$(document).ready(function() { //Cuando la página se ha cargado por completo

    //Ponemos el foco en el primer input
    $(".auto-focus").focus();

    $("form").hide();

    $(".add-button").on("click", function(){
    	$("form").show();
    });

    $("form").on("submit", function() {
        var artist = $.trim($("#artist").val());
        if (artist == "") {
            alert("El artista no puede estar vacío");
            return false;
        }
        var song = $.trim($("#title").val());
        if (song == "") {
            alert("La canción no puede estar vacía");
            return false;
        }

        var url = $.trim($("#song_url").val());

        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

        if (url == "" && pattern.test(url) == false) {
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
            success: function() {
            	$("form").hide();
            	reloadLista();
            },
            error: function() {
                alert("Se ha producido un error");
            }

        });

        return false;
    });

    function reloadLista() {
        $.ajax({
            method: 'get',
            url: "/api/songs/",
            success: function(data) {
                console.log("Canciones recuperadas", data);
                var html = "";
                for (var i in data) {
                    var artist = data[i].artist;
                    var song = data[i].song;
                    var url = data[i].url || "";
                    var id = data[i].id;
                    html += '<li>';
                    html += artist + " ";
                    html += song + " ";
                    html += ' <i class="fa fa-play-circle play-button" data-songid ="' +id+ '"></i>';
                    html += ' <i class="fa fa-pencil modify-pencil" data-songid ="' +id+ '"></i>';
                    html += ' <i class="fa fa-trash delete-trash" data-songid ="' +id+ '"></i>';
                    html += ' </li>';
                }
                $(".lista").html(html); // innerHTML=html
            }
        });
    }

    reloadLista();

    $(".lista").on("click", ".delete-trash", function(){ //Si se añaden elementos de la lista, añadir evento al icono de la basura
		var self = this;
		var id = $(self).data("songid"); 
		$.ajax({
			url:"/api/songs/" + id,
			method: "delete",
			success: function(){
				$(self).parent().remove();
			}
		});
    });

	$(".lista").on("click", ".modify-pencil", function(){ //Si se añaden elementos a la lista, añadir evento al icono del lapiz de modificar elemento
		//mostrar el formulario y en el formulario añadir al botón de "modificar" el evento de modificar
		$("form").show();
    });

    function modifySong(){ //Función a llamar cuando se va a modificar una canción
    	$.ajax({
    		url: "/api/songs/" + id,
    		method: "put",
    		data: JSON.stringify({
                artist: artist,
                song: song,
                url: url
            }),
            success: reloadLista() //Al acabar, actualizar la lista y quitar el formulario
    	});
    };


});
