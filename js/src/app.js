$(document).ready(function() { //Cuando la página se ha cargado por completo

    //Ponemos el foco en el primer input
    $(".auto-focus").focus();

    var lista = $(".lista");
    var formulario = $("form");
    var controlMostrarForm = false; //Para controlar si se ha pulsado ya anteriormente el botón de +  
    var elementoAudio = $("audio");

    var body = $("body");

    body.addClass("show_list");

    reloadLista();

    $(".add-button").on("click", function() {
        if (controlMostrarForm == false) {
            $("#artist").val("");
            $("#title").val("");
            $("#song_url").val("");
            $("#elementoId").val("");
            body.addClass("show_form");
            body.removeClass("show_list");
            controlMostrarForm = true;
        } else {
            $("#artist").val("");
            $("#title").val("");
            $("#song_url").val("");
            $("#elementoId").val("");
            body.addClass("show_list");
            body.removeClass("show_form");
            controlMostrarForm = false;
        }


    });

    $(".buttonCancelar").on("click", function() { //Botón cancelar del formulario
        formulario.hide();
        lista.show();
        elementoAudio.show();
        $("#artist").val("");
        $("#title").val("");
        $("#song_url").val("");
        $("#elementoId").val("");

        body.addClass("show_list");
        body.removeClass("show_form");
    });

    $("form").on("submit", function() {
        var id = $("#elementoId").val(); //campo oculto del formulario con el id

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

        if (url == "" || pattern.test(url) == false) {
            alert("La url de la canción no es válida");
            return false;
        }

        if (id == "") { //Se va a añadir una nueva
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
                    body.addClass("show_list");
                    body.removeClass("show_form");
                    reloadLista();
                    elementoAudio.show();
                },
                error: function() {
                    alert("Se ha producido un error");
                }
            });
        } else { //Se va a modificar una
            $.ajax({
                url: "/api/songs/" + id,
                method: 'put',
                data: JSON.stringify({
                    artist: artist,
                    song: song,
                    url: url
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function() {
                    reloadLista();
                    body.addClass("show_list");
                    body.removeClass("show_form");
                    elementoAudio.show();
                    controlMostrarForm = false;
                    //Al acabar, actualizar la lista y quitar el formulario
                    $("#artist").val("");
                    $("#title").val("");
                    $("#song_url").val("");
                    $("#elementoId").val("");
                }
            });
        }
        return false;
    });

    function reloadLista() {
        $.ajax({
            method: 'get',
            url: "/api/songs/",
            success: function(data) {
                console.log("Canciones recuperadas", data);
                var html = "";
                html += '<ul>';
                for (var i in data) {
                    var artist = data[i].artist;
                    var song = data[i].song;
                    var url = data[i].url || "";
                    var id = data[i].id;
                
                    html += '<div class="container">';
                    html += '<div class="row">';
                    html += '<li>';
                    html += '<div class="col-phone-6">';
                    html += '<div class="data">';
                    html += '<i class="fa fa-music"></i>' + " ";
                    html += artist + " ";
                    html += song + " ";
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="col-phone-6">';
                    html += '<div class="icon">';
                    html += ' <i class="fa fa-play-circle play-button" fa-lg data-songid="' + id + '"></i>';
                    html += ' <i class="fa fa-pencil modify-pencil" fa-lg data-songid="' + id + '"></i>';
                    html += ' <i class="fa fa-trash delete-trash" fa-lg data-songid="' + id + '"></i>';
                    html += '</div>';
                    html += '</div>';
                    html += ' </li>';
                    html += '</div>';
                    html += '</div>';

                }
                html += '</ul>';
                lista.html(html); // innerHTML=html
            }
        });
    }


    $(".lista").on("click", ".delete-trash", function() { //Si se añaden elementos de la lista, añadir evento al icono de la basura
        var self = this;
        var id = $(self).data("songid");
        $.ajax({
            url: "/api/songs/" + id,
            method: "delete",
            success: function() {
                $(self).parent().parent().parent().remove();
            }
        });
    });

    $(".lista").on("click", ".modify-pencil", function() { //Si se añaden elementos a la lista, añadir evento al icono del lapiz de modificar elemento
        //mostrar el formulario y en el formulario añadir al botón de "modificar" el evento de modificar
        var elementoI = this;
        var idElemento = $(elementoI).data("songid");
        $.ajax({ //Coger los datos de ese id desde la base de datos
            url: "/api/songs/" + idElemento,
            method: "get",
            success: function(data) {
                console.log("Canciones recuperadas2", data);
                //Obtener los valores de ese elemento para ponerlos en el cuestionario
                var artist;
                var song;
                var url;
                artist = data.artist;
                song = data.song;
                url = data.url;

                //Ahora poner esos valores en los valores del cuestionario
                $("#artist").val(artist);
                $("#title").val(song);
                $("#song_url").val(url);
                $("#elementoId").val(idElemento);
            }
        });

        body.addClass("show_form");
        body.removeClass("show_list");
        elementoAudio.hide();
    });

    $(".lista").on("click", ".play-button", function() {
        var elementoI = this;
        var idElemento = $(elementoI).data("songid");
        $.ajax({ //Coger los datos de ese id desde la base de datos
            url: "/api/songs/" + idElemento,
            method: "get",
            success: function(data) {
                //Obtener la url de este elemento para poder reproducirlo
                var url;
                url = data.url;
                //Ahora poner esa url en el elemento audio 
                elementoAudio.attr("src", url);
            }
        });
    });
});
