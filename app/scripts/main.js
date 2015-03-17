'use strict';


var idDoctor;
$(document).ready(function() {

    var miTabla = $('#miTabla').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': 'php/cargaTabla.php',
        'language': {
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningún dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
                'sFirst': 'Primero',
                'sLast': 'Último',
                'sNext': 'Siguiente',
                'sPrevious': 'Anterior'
            },
            'oAria': {
                'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                'sSortDescending': ': Activar para ordenar la columna de manera descendente'
            }
        },
        'columns': [{
            'data': 'nombre'
        }, {
            'data': 'numcolegiado'
        }, {
            'data': 'nombreClinica',
            'render': function(data) {
                return '<li>' + data + '</li><br>';
            }
        }, {
            'data': 'idClinica',
            "visible": false
        }, {
            'data': 'idDoctor',
            'render': function(data) {
                return '<a class="btn btn-primary editarbtn" href=../php/modificaDoctor.php?id_doctor=' + data + '>Editar</a><a data-toggle="modal" data-target="#basicModal"  class="btn btn-danger borrarbtn" href=../php/borraDoctor.php?id_doctor=' + data + '>Borrar</a>';
            }
        }]
    });

    //CONTROL DEL BOTON EDITAR
    $('#miTabla').on('click', '.editarbtn', function(e) {
        e.preventDefault();

        $('#tabla').fadeOut(100);
        $('#formulario').fadeIn(100);

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idDoctor').val(aData.idDoctor);
        $('#nombre').val(aData.nombre);
        $('#numcolegiado').val(aData.numcolegiado);
        $('#clinicas').val(aData.nombreClinica);
        cargarTarifas();
        var str = aData.idClinica;
        str = str.split(",");
        $('#clinicas').val(str);
    });

    //CONTROL DEL BOTON BORRAR
    $('#miTabla').on('click', '.borrarbtn', function(e) {
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        idDoctor = aData.idDoctor;
    });
    $('#basicModal').on('click', '#confBorrar', function(e) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'php/borraDoctor.php',
            data: {
                id_doctor: idDoctor
            },
            error: function(xhr, status, error) {
                $.growl({
                    icon: "glyphicon glyphicon-remove",
                    message: "ERROR: fallo al borrar"
                }, {
                    type: "danger"
                });
            },
            success: function(data) {
                var $mitabla = $("#miTabla").dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();
                $.growl({
                    icon: "glyphicon glyphicon-remove",
                    message: "BORRADO CORRECTO"
                }, {
                    type: "success"
                });
            },
            complete: {}
        });
        $('#tabla').fadeIn(100);
    });

    $('#formEditar').validate({

        rules: {
            nombre: {
                required: true,
                lettersonly: true,
            },
            numcolegiado: {
                digits: true
            },
            clinicas: {
                required: true
            }
        },
        submitHandler: function() {
            idDoctor = $('#idDoctor').val();
            nombre = $('#nombre').val();
            numcolegiado = $('#numcolegiado').val();
            id_clinica = $('#clinicas').val();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'php/modificaDoctor.php',
                data: {
                    idDoctor: idDoctor,
                    nombre: nombre,
                    numcolegiado: numcolegiado,
                    id_clinica: id_clinica

                },
                error: function(xhr, status, error) {
                    $.growl({

                        icon: "glyphicon glyphicon-remove",
                        message: "ERROR:fallo al editar"

                    }, {
                        type: "danger"
                    });

                },
                success: function(data) {
                    var $mitabla = $("#miTabla").dataTable({
                        bRetrieve: true
                    });
                    $mitabla.fnDraw();
                    if (data[0].estado == 0) {
                        $.growl({
                            icon: "glyphicon glyphicon-ok",
                            message: "EDICIÓN CORRECTA"
                        }, {
                            type: "success"
                        });
                    } else {
                        $.growl({

                            icon: "glyphicon glyphicon-remove",
                            message: "ERROR:fallo al editar"

                        }, {
                            type: "danger"
                        });
                    }

                },
                complete: {

                }
            });

            $('#tabla').fadeIn(100);
            $('#formulario').fadeOut(100);
        }

    });

    $('#formCrear').validate({

        rules: {
            nombreNuevo: {
                required: true,
                lettersonly: true
            },
            numcolegiadoNuevo: {
                required: true,
                digits: true
            },
            clinicas2: {
                required: true
            }
        },
        submitHandler: function() {
            nombreNuevo = $('#nombreNuevo').val();
            numcolegiadoNuevo = $('#numcolegiadoNuevo').val();
            clinicas2 = $('#clinicas2').val();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'php/creaDoctor.php',
                data: {
                    nombreNuevo: nombreNuevo,
                    numcolegiadoNuevo: numcolegiadoNuevo,
                    clinicas2: clinicas2
                },
                error: function(xhr, status, error) {
                    $.growl({

                        icon: "glyphicon glyphicon-remove",
                        message: "ERROR: fallo al crear doctor"

                    }, {
                        type: "danger"
                    });

                },
                success: function(data) {
                    var $mitabla = $("#miTabla").dataTable({
                        bRetrieve: true
                    });
                    $mitabla.fnDraw();
                    if (data[0].estado == 0) {

                        $.growl({

                            icon: "glyphicon glyphicon-ok",
                            message: "INSERCCIÓN CORRECTA"

                        }, {
                            type: "success"
                        });
                    } else {

                        $.growl({

                            icon: "glyphicon glyphicon-remove",
                            message: "ERROR: fallo al crear doctor"

                        }, {
                            type: "danger"
                        });
                    }

                },
                complete: {}
            });
            $('#formularioCrear').fadeOut(100);
            $('#tabla').fadeIn(100);

        }

    });

    /*boton añadir doctor,oculto tabla para mostrar form*/
    $('#creaDoc').click(function(e) {
        e.preventDefault();
        $('#tabla').fadeOut(100);
        $('#formularioCrear').fadeIn(100);
        cargarClinicaCrear();
    });


    function cargarClinicaCrear() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'php/listaClinicas.php',
            async: false,
            error: function(xhr, status, error) {},
            success: function(data) {
                $('#clinicas2').empty();
                $.each(data, function() {
                    $('#clinicas2').append(
                        $('<option ></option>').val(this.id_clinica).html(this.nombre)
                    );
                });

            },
            complete: {}
        });
    }


    function cargarTarifas() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'php/listaClinicas.php',
            async: false,
            error: function(xhr, status, error) {},
            success: function(data) {
                $('#clinicas').empty();
                $.each(data, function() {
                    $('#clinicas').append(
                        $('<option ></option>').val(this.id_clinica).html(this.nombre)
                    );
                });

            },
            complete: {}
        });
    }

    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Solo se permiten letras");


});
