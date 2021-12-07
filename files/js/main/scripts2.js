
// randomize itens
jQuery.fn.randomize = function(selector){
    var $elems = selector ? jQuery(this).find(selector) : jQuery(this).children(),
    $parents = $elems.parent();

    $parents.each(function(){
        jQuery(this).children(selector).sort(function(){
            return Math.round(Math.random()) - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};

// Variável global que conterá elementos do menu âncora, para ser usada a cada "scrollada"
scroll_trackers = [];

// Ao carregar ou redimensionar a tela, recalculamos as posições dos destinos dos links do menu âncora
function calcula_posicoes_de_ancoras() {
    // Só vale dentro do "container"
    var o_container = jQuery( 'main > section > div.container' );
    // Se tem "container"
    if ( o_container.length ) {
        // Altura do menu fixo
        var o_menu_height = jQuery( 'header.main-header' ).first().outerHeight() + jQuery( 'nav.wrapper' ).first().outerHeight() + 30; // mais 30 pixels de lambuja
        // Inclui a altura da barra de admin, se houver
        var o_admin_bar = jQuery( '#wpadminbar' );
        if ( o_admin_bar.length ) o_menu_height += o_admin_bar.outerHeight();
        // Começo do "container"
        var o_comeco = o_container.offset().top - o_menu_height;
        // Fim do "container"
        var o_fim = o_comeco + o_container.outerHeight();
        // Array com todos os "começos"
        var os_comecos = [];
        // Cada link âncora
        jQuery( '.menu .js-ancora .sub-menu .initial-current a[href*="#"]' ).each( function () {
            // Calcula o destino
            var o_href = jQuery.attr( this, 'href' );
            // Só o "hash" do destino (a parte depois do "#")
            var o_hash = ( o_href.indexOf( '#' ) > -1 ) ? o_href.split( '#' ).pop() : '';
            // Destino padrão: começo do "container"
            var o_dest = o_container;
            // Se tem hash, procura o destino de verdade
            if ( o_hash ) o_dest = jQuery( '#' + o_hash );
            // Se não achou, é o "container" mesmo
            if ( !o_dest.length ) o_dest = o_container;
            // Posição de destino: começo da "área" dessa âncora
            var o_scroll_start = o_dest.offset().top - o_menu_height;
            // Fim da "área" dessa âncora: por padrão, definimos todas as áreas pra terminar lá no fim do "container"
            var o_scroll_end = o_fim;
            // Salva estes dados calculados neste link, e põe uma classe marota nele
            scroll_trackers.push( jQuery( this ).data( 'scroll-start', o_scroll_start ).data( 'scroll-end', o_scroll_end ) );
            // Popula array de "começos"
            os_comecos.push( o_scroll_start );
            // Ordena o array toda vez
            os_comecos.sort();
        // Cada link âncora, de novo
    } ).each( function () {
            // Dado salvo: início da "área" dessa âncora
            var o_scroll_start = jQuery( this ).data( 'scroll-start' );
            // Dado salvo: fim da "área" dessa âncora (por enquanto, tá lá no fim do container)
            var o_scroll_end = jQuery( this ).data( 'scroll-end' );
            // Varremos o array de "começos"
            jQuery( os_comecos ).each( function () {
                // Se existe um "começo" que é maior que o "começo" da área dessa âncora,
                // e menor que o "final" da área dessa âncora, então a área dessa âncora
                // deveria acabar antes, ou seja, no "começo" da próxima área
                if ( ( this > o_scroll_start ) && ( this < o_scroll_end ) ) o_scroll_end = this;
            } );
            // Atualizamos o dado: fim da "área" dessa âncora
            jQuery( this ).data( 'scroll-end', o_scroll_end );
        } );
}
}
// A cada "scrollada", recalculamos itens acesos e apagados do menu âncora
function trata_submenu_de_ancoras( top_pos ) {
    // Cada link-âncora do menu fixo
    jQuery( scroll_trackers ).each( function () {
        // Dado salvo: início da "área" dessa âncora
        var o_scroll_start = jQuery( this ).data( 'scroll-start' );
        // Dado salvo: fim da "área" dessa âncora
        var o_scroll_end = jQuery( this ).data( 'scroll-end' );
        // Se tem início e fim (se é tudo diferente de zero)
        if ( o_scroll_start * o_scroll_end ) {
            // Pega o elemento <li> "pai" desse link (o pai é quem recebe a classe)
            var o_pai = jQuery( this ).parents( 'li' ).first();
            // Se o scroll da tela está no "range" da área dessa âncora
            if ( ( top_pos >= o_scroll_start ) && ( top_pos < o_scroll_end ) ) {
                // O pai recebe a classe "ativa"
                o_pai.addClass( 'current-menu-item' );
            // Se não
        } else {
                // O pai perde a classe "ativa"
                o_pai.removeClass( 'current-menu-item' );
            }
        }
    } );
}

// Verificando qual o tamanho da tela
function dispositivo() {
    var tamanho_tela = jQuery( window ).width();
    if ( tamanho_tela > 1024 ) {
        return 'desktop';
    } else if ( tamanho_tela < 768 ) {
        return 'mobile';
    } else {
        return 'tablet';
    }
}

// Inicialização
jQuery( function( jQuery ) {

    // Carrossel de imagens do header
    jQuery( 'header .DifTop .HeaderSlider .Slider' ).slick( {
        slidesToShow: 1,
        dots: true,
        fade: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
    } );

    // Carrossel de manchetes da home
    jQuery( '.UltimasNoticias .SliderManchetes' ).slick( {
        slidesToShow: 1,
        dots: false,
        arrows: true,
        fade: true,
        autoplay: true,
        autoplaySpeed: 4000
    } );

    // abrir menu no mobile
    jQuery( '.MobMenu.DeskHidden .OpenMenu' ).click( function() {
        if ( dispositivo() != 'desktop' ) {
            jQuery( '.MenuMobile, .Overlay' ).addClass( '-ativo' );
            jQuery( 'body' ).css( 'overflow', 'hidden' );
        }
    } );

    // Fechar menu mobile
    jQuery( '.Overlay' ).click( function() {
        if ( dispositivo() != 'desktop' ) {
            jQuery( this ).removeClass( '-ativo' );
            jQuery( '.MenuMobile' ).removeClass( '-ativo' );
            jQuery( 'body' ).css( 'overflow', 'auto' );
        }
    } );

    // appendando o menu principal no menu de site no mobile
    // if ( jQuery.inArray( dispositivo(), [ 'mobile', 'tablet' ] ) > -1 ) {
    //     var menu_site = jQuery( '#menu-sites-relacionados-topo-header' ),
    //     menu_principal = jQuery( '#menu-principal' );
    //     menu_site.append( menu_principal.children( 'li' ).clone() );

    // Clique nos itens do menu que tem filhos
    menu_principal = jQuery( '#menu-principal' );
    menu_superior = jQuery( '#menu-superior' );
    menu_site = jQuery( '#menu-sites-relacionados-topo-header' );
    jQuery( '.menu-item-has-children', menu_superior ).click( function() {
        jQuery( this ).toggleClass( '-ativo' );
    } );
    jQuery( '.menu-item-has-children', menu_principal ).click( function() {
        jQuery( this ).toggleClass( '-ativo' );
    } );
    jQuery( '.menu-item-has-children', menu_site ).click( function() {
        jQuery( this ).toggleClass( '-ativo' );
    } );
    // }

    // Sobe ao topo ao clicar
    jQuery('.cc-share-buttons-module button').each(function(){
        jQuery(this).on('click', function() {
            jQuery("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        });
    });


    // Deixa o dropdown mobile scrolavel

    if( dispositivo() != 'desktop' ){
        jQuery( '.dropdown' ).each( function(){
            var dropdown = jQuery( this ).find( '.Scrolavel' ),
            strong_w = dropdown.find( 'strong' ).outerWidth(),
            ul_w = dropdown.find( 'ul' ).outerWidth();
            //50 representa margin entre os elementos
            dropdown.width( strong_w + ul_w + 50 );
        });
    };

    // menus de organogramas: clique nos primeiros níveis ("setores" e "organogramas") só abrem e fecham seus respectivos submenus
    jQuery( '.menu-setores > a, .menu-organogramas > a' ).on( 'click', function () {
        jQuery( jQuery( this ).toggleClass( 'submenu-aberto' ).attr( 'href' ) ).toggle();
        return false;
    } );
    // clique nos links do submenu de "setores"
    jQuery( '#organograma-setores a' ).on( 'click', function () {
        // de cara, já fecha esse submenu
        jQuery( '.menu-setores > a' ).removeClass( 'submenu-aberto' );
        jQuery( '#organograma-setores' ).hide();
        // troca item ativo desse submenu
        jQuery( '#organograma-setores li' ).removeClass( 'setor-ativo' );
        jQuery( this ).parents( 'li' ).addClass( 'setor-ativo' );
        // troca o texto do primeiro nível de "setores"
        jQuery( this ).parents( '.menu-setores' ).children( 'a' ).children( 'span.text' ).html( jQuery( this ).text() );
        // esconde todos os menus de "organogramas"
        jQuery( '.menu-organogramas' ).hide().children( 'a' ).removeClass( 'submenu-aberto' );
        // mostra só o menu de "organogramas" relativo ao setor clicado, e também seu submenu
        jQuery( jQuery( jQuery( this ).attr( 'href' ) ).show().children( 'a' ).addClass( 'submenu-aberto' ).attr( 'href' ) ).show();
        return false;
    } );



    // JS de click do menu principal
    if( dispositivo() == 'desktop' ){
        var o_menu = jQuery( '.MenuPages' );


        o_menu.find( '.menu > .menu-item > a' ).on( 'click', function(){
            var o_menu_item = jQuery( this ).parent();

                // Remove a formatação do item com menu fechado
                jQuery( '.current-menu-item' ).removeClass( 'current-menu-item' );
                // Fecha qualquer menu que estava anteriormente aberto
                if( !o_menu_item.hasClass( '-ativo' ) ){
                    o_menu.find( '.-ativo' ).removeClass( '-ativo' );
                    o_menu_item.addClass( '-ativo' );
                }

                return false;
            });

        jQuery( '.site-filho .MenuPages ul.menu > .menu-item > a' ).click( function () {
            location.href = this.href;
        } );


        // Se for página que possua um pai no menu, clica nele para vir ativo
        // if ( jQuery( '.menu-principal-container' ).find( '.pai-category' ) ) {
        //     jQuery( '.menu-principal-container .pai-category > a' ).click();
        // }

    }

    /******************************
        Modal Organograma
        ******************************/
        
       var activePopper = undefined;
       var reference = jQuery('.popper-organograma');
       var popper = jQuery('.popper-organograma-box');
       popper.hide();

       jQuery('.popper-organograma').click(function() {

         var conteudo = jQuery(this).data('modal');
         //console.log("conteudo", conteudo);
         jQuery('#popper-organograma-box h3.box-titulo').html(conteudo.titulo);
         jQuery('#popper-organograma-box h4.box-sub').html(conteudo.subtitulo);
         jQuery('#popper-organograma-box div.conteudo').html(conteudo.texto);

         var popperOptions = {
           placement: 'right',
           modifiers: {
             flip: {
               behavior: ['left', 'right', 'top', 'bottom']
             },
             offset: {
               enabled: true,
               offset: '0,15'
             }
           }
         };

         if(typeof activePopper === "undefined") {
           popper.show();
           activePopper = new Popper(reference, popper, popperOptions);
         } else {            
           var newPopper = new Popper(reference, popper, popperOptions);

           if(newPopper.popper.top == activePopper.popper.top) {
             activePopper.destroy();
             newPopper.destroy();
             activePopper = undefined;
             newPopper = undefined;
             popper.hide();
           } else {
             popper.show();
             activePopper = data;
           }
         }
       });

    //-----------------------------------
    // JS VELHO QUE FOI ÚTIL NO SITE NOVO
    //-----------------------------------

    var cloneData = jQuery('.agenda-horarios .agenda-dia h2').clone();
    function cloneAgenda(){
        //Refine sua busca mobile:
         //virifica o tamanho da tela

         if(jQuery(window).outerWidth(true) <= 1024){
            if ( !jQuery('.agenda-horarios .agenda-dia h2').length ) {
                jQuery('.agenda-horarios .agenda-dia').prepend(cloneData);

                jQuery('.calendario h2').remove();
            }
        }
        //verifica o tamanho da tela
        if(jQuery(window).outerWidth(true) <= 768){

            jQuery('.-js-h2cloned').each(function(){
                jQuery(this).prepend(cloneData);

                jQuery('.agenda-horarios .agenda-dia h2').remove();
            });
        }
    }

    cloneAgenda();

    jQuery( window ).resize(function(){
        cloneAgenda();
    })

    // Modal Formulário Busca
    jQuery( '.busca-servico .alerta' ).click( function() {
        if (jQuery( this ).hasClass( '-ativo' )){
            jQuery( this ).remove( '-ativo' );
        } else {
            jQuery( this ).addClass( '-ativo' );
        }

        return false;
    } );
    jQuery( '.busca-servico .fechar' ).click( function() {
        jQuery( '.modal-feedback:visible, .modal-confirmacao:visible' ).hide( 'slow' );
        return false;
    } );


    /*if ( jQuery( document ).width() > 1024 ) {

        // Numero magido do menu fixo
        var magic_number = ( topoffset - jQuery( '.MenuMobile' ).outerHeight() ),
            margin_top_maluca = parseInt( jQuery( '.MenuPages' ).css('margin-top').replace('px',''), 10 ),
            magic_padding = ( jQuery( '.main-header' ).outerHeight() + jQuery( '.main-header + nav' ).outerHeight() ) + margin_top_maluca;

        // Põe classe no body que fixa sub-menus no topo (por CSS)
        jQuery( window ).scroll( function () {
            var top_pos = ( jQuery( window ).scrollTop() || jQuery( 'body' ).scrollTop() ),
                o_body = jQuery( 'body' );

            // Top_pos maior que o tamanho do header+nav
            if ( top_pos > magic_number ) {
                if( !o_body.hasClass( '-fixed-menu' ) ){
                    o_body.addClass( '-fixed-menu' );
                    jQuery( 'main' ).css( 'margin-top', magic_padding )
                }
            } else {
                o_body.removeClass( '-fixed-menu' );
                jQuery( 'main' ).css( 'margin-top','0px' );

                    if( o_body.hasClass( '.home' ) ){
                        // Corrige slick caso inicie com display: none
                        jQuery( '.slick-slider' ).slick( 'slickGoTo', 0, true );
                    }
            }
            // A cada scrollada, recalcula o acende-apaga do menu de âncoras
            trata_submenu_de_ancoras( top_pos );
        } );
    }*/



    ///////////////////////////////////////
    /*  SCRIPT GALERIA PADRÃO COM SLICK  */
    ///////////////////////////////////////
    jQuery( '.gallery' ).each( function() {
        var gallery_id = jQuery( this ).attr( 'id' ),
        qtd_imgs = jQuery( this ).find( 'img' ).size(),
        pack_imgs = jQuery( this ).find( 'img' ).clone(),
        alt_img =  jQuery( this ).find( '.gallery-item' ).first().find( '.gallery-caption' ).html(),
        slide_duration = 2800,
        atividades = [],
        lugares = [],
        html_atividades = "",
        html_lugares = "";

        // remove os <br> padrões da saída do wordpress
        jQuery( this ).find( 'br' ).remove();

        // Alimenta a array dos filtros se encontrar o data
        if( jQuery( this ).find( 'img' ).data( 'atividades' ) ) {
            jQuery( this ).find( 'img').map( function() {
                if ( jQuery( this ).data( 'atividades' ) ) {
                    limpa_data( jQuery( this ).data( 'atividades' ), atividades );
                };
                if ( jQuery( this ).data( 'atividades' ) ) {
                    limpa_data( jQuery( this ).data( 'lugares' ), lugares );
                };
            } );
            // prepara os array para ser impresso no html
            atividades  = atividades.sort(); // deixa em ordem alfabetica
            for ( var i = 0; i < atividades.length; i++ ) {
                html_atividades += '<li><a href="#">'+ atividades[i] +'</a></li>';
            };
            lugares  = lugares.sort(); // deixa em ordem alfabetica
            for ( var i = 0; i < lugares.length; i++ ) {
                html_lugares += '<li><a href="#">'+ lugares[i] +'</a></li>';
            };
        }
        var args = {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            nextArrow: '<button type = "button" class = "slick-next slick-arrow"> &gt; </ button>',
            prevArrow: '<button type = "button" class = "slick-prev slick-arrow"> &lt; </ button>',
            dots: false,
            pauseOnHover: false,
            centerMode: false,
            autoplaySpeed: slide_duration,
        };
        if ( jQuery( '.' + gallery_id + '.mini-slider' ).length ) {
            args[ 'asNavFor' ] = '.' + gallery_id + '.mini-slider';
        }

        // Inicia o slick principal
        jQuery( this ).slick( args );

        if ( html_atividades + html_lugares ) {
            // Adiciona os elementos de navegação acima do slider
            jQuery( this ).prepend(
                '<div class="slide-filter">'+
                '<div class="dropdown-turismo">' +
                '<button class="action">O QUE FAZER?</button>' +
                '<div class="drop-content atividades">' +
                '<ul class="oque-fazer" data-tipo="oque-fazer">' + html_atividades + '</ul>' +
                '</div>' +
                '</div>' +
                '<div class="dropdown-turismo">' +
                '<button class="action">PRINCIPAIS DESTINOS</button>' +
                '<div class="drop-content destinos">' +
                '<ul class="principais-destinos" data-tipo="principais-destinos">' + html_lugares + '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="slide-actions" data-id="' + gallery_id +  '">' +
                '<button class="button-show ' + gallery_id + '"> SlideShow </button>' +
                '<button class="button-full ' + gallery_id + '"> FullScreen </button>' +
                '</div>' +
                '<div class="slide-infos">' +
                '<div class="slide-index ' + gallery_id + '">' + '<p> <span> 1 </span> / ' + qtd_imgs + '</p> </div>' +
                '<div class="slide-alt ' + gallery_id + '"> <p>' + (alt_img == undefined ? '' : alt_img) + ' </p> </div>' +
                '<div class="mini-slider ' + gallery_id + '">' + '</div>' +
                '</div>'
                );

            jQuery( this ).addClass( 'gallery-with-filter' );

            // Eventos de click no filtro
            var o_filtro = jQuery( '.slide-filter' );

            o_filtro.find( '.dropdown-turismo .action' ).on( 'click', function(){

                jQuery( this ).toggleClass( '-on' );

            });


        }else{
            // Add class que corrige CSS da galeria sem filtro
            jQuery( this ).addClass( '-nofilter' );
            // Constroi galeria sem filtro
            jQuery( this ).prepend(
                '<div class="slide-actions" data-id="' + gallery_id +  '">' +
                '<button class="button-show ' + gallery_id + '"> SlideShow </button>' +
                '<button class="button-full ' + gallery_id + '"> FullScreen </button>' +
                '</div>' +
                '<div class="slide-infos">' +
                '<div class="slide-index ' + gallery_id + '">' + '<p> <span> 1 </span> / ' + qtd_imgs + '</p> </div>' +
                '<div class="slide-alt ' + gallery_id + '"> <p>' + (alt_img == undefined ? '' : alt_img) + ' </p> </div>' +
                '<div class="mini-slider ' + gallery_id + '">' + '</div>' +
                '</div>'
                )
        }



        // Adiciona as imagens para o mini slick de navegação
        // e adiciona um data com o ID da galeria
        if ( jQuery( '.' + gallery_id + '.mini-slider' ).length ) {
            jQuery( '.' + gallery_id + '.mini-slider' ).html( pack_imgs ).data( 'id', gallery_id );
            // Inicia o Slider de navegação
            jQuery( '.' + gallery_id + '.mini-slider' ).slick( {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                asNavFor: jQuery( this ),
                infinite: true,
            } );
        }

        // Depois da troca de slide
        jQuery( this ).on( 'afterChange', function( event, slick, currentSlide, nextSlide ) {
            var o_slider = jQuery( slick.$slider[0] );
            alt = jQuery( this ).find( '.slick-current .gallery-caption' ).html();
            qtd_imgs = jQuery( '.gallery-item:not(.slick-cloned)', o_slider ).length;

            // Imprime posição do slide
            jQuery( '.slide-index', o_slider ).html(
                '<p>' +
                '<span>' +
                (currentSlide+1) +
                '</span>' +
                ' / ' + qtd_imgs +
                '</p>' );
            // Imprime o alt da imagem
            jQuery( '.slide-alt', o_slider ).html( '<p>' + (alt==undefined ? '' : alt) + '</p>' );
            // alterando o carrossel do nav
            jQuery( '.mini-slider', o_slider ).slick ('slickGoTo', currentSlide, true );
        } );


        // Function remove Pipes e valores repetidos
        function limpa_data( data, target ) {
            data = data.split( '|' );
            data.forEach( function( valor ) {
                // garante que não entre valores em branco
                if ( valor ){
                    if ( target.indexOf( valor ) == -1 ) {
                        target.push( valor );
                    }
                }
            } );
            return( true );
        };

    } );

    // Action imagens mini Slide
    jQuery( '.mini-slider .slick-slide' ).on( 'click', function() {
        var slide_target = jQuery( this ).data( 'slick-index' ),
        gallery_id = jQuery( this ).parents( '.mini-slider' ).data( 'id' ),
        mini_slider = jQuery( this ).parents( '.mini-slider' );

        // Direciona o slide principal, ao clicar em um dos itens do slide de navegação
        // jQuery( '#' + gallery_id ).slick ('slickGoTo', slide_target, false );
        mini_slider.slick( 'slickGoTo', slide_target, false );
    } );

    // Action Button SlideShow
    jQuery( '.button-show' ).on( 'click', function() {
        var gallery_id = jQuery( this ).parent().data( 'id' ),
        gallery_action = jQuery( this ).data( 'playing' ) == true ?
        'slickPause' :
        'slickPlay',
        gallery_playing = gallery_action == 'slickPause' ?
        false :
        true;
        // Passa pro slick se ele deve dar play ou não
        jQuery( '#' + gallery_id ).slick( gallery_action );
        // Passa pro data do botao se o slick ta com auto play ou não
        jQuery( this )
        .data( 'playing', gallery_playing )
        .removeClass( 'slickPause' )
        .removeClass( 'slickPlay' )
        .addClass( gallery_action );
    } );

    // Action Button Full Screen
    jQuery( '.button-full' ).on( 'click', function() {
        var gallery_id  = jQuery( this ).parent().data( 'id' ),
        gallery_action = jQuery( '.button-show' ).hasClass( 'slickPause' ) == true ? 'slickPause' : 'slickPlay';

        if( gallery_action == 'slickPlay' ){
            jQuery( '.button-show' ).removeClass( 'slickPause' ).removeClass( 'slickPlay' );
            jQuery( '.button-show' ).addClass( gallery_action );
            jQuery( '#' + gallery_id ).slick( gallery_action );
        }
        // Adiciona a classe que transforma o slick em FullScreen
        jQuery( '#' + gallery_id ).toggleClass( '-fullscreen' );
        // 'reseta' o slick para não quebrar
        jQuery( '#' + gallery_id ).slick( 'setPosition' );
    } );


    // Filtrar oque fazer
    jQuery( '.slide-filter li' ).on( 'click', function() {
        var gallery_id  = jQuery( this ).parents( '.gallery ').attr( 'id' ),
        tipo = jQuery( this ).parent().data( 'tipo' ),
        data_tipo =  tipo === 'oque-fazer' ? 'atividades' : 'lugares',
        clicked = jQuery( this ).find( 'a' ).html(),
        target = jQuery( '.slide-filter .' + tipo + ' .-target a' ),
        slick_principal = jQuery( '#'+gallery_id ),
        slick_navegacao = jQuery( '.'+gallery_id+'.mini-slider' ),
        busca = '|' + clicked + '|';

        // Limpa os filtros antigos
        slick_principal.slick( 'slickUnfilter' );
        slick_navegacao.slick( 'slickUnfilter' );

        //  garante que nenhum outro item do dropdown esteja laranja
        jQuery( this ).parents( '.slide-filter' ) .find( '.-target' ).removeClass( '-target' );
        // deixa o item clicado laranja
        jQuery( this ).addClass( '-target' );

        // Garante que nenhuma atividade está marcada para filtro
        jQuery( '.gallery .-filtrar' ).removeClass( '-filtrar' );
        // Procura no slide principal quem tem o data
        slick_principal.find( '[data-' + data_tipo + ']:not(.slick-cloned)' ).map( function(){

            if ( ( jQuery( this ).data( data_tipo ) ) && jQuery( this ).data( data_tipo ).indexOf( busca ) !== -1 ){
                jQuery( this ).parents( '.gallery-item' ).addClass( '-filtrar' );
            };
        });
        // Procura no slide de navegacao os datas
        slick_navegacao.find( 'img:not(.slick-cloned)' ).map( function(){
            if ( ( jQuery( this ).data( data_tipo ) ) && jQuery( this ).data( data_tipo ).indexOf( busca ) !== -1 ){
                jQuery( this ).addClass( '-filtrar' );
            };
        });

        // Filtra o slide pela classe adicionada anteriormente
        slick_principal.slick( 'slickFilter', '.-filtrar' );
        slick_navegacao.slick( 'slickFilter', '.-filtrar' );

        slick_principal.slick( 'slickGoTo', 0 );

        return( false );
    });




    //-----------------------------------
    // Identificando Background Color
    // Para adicionar sombra no menu via CSS
    //-----------------------------------


    if( jQuery( 'main > section:nth-child(2)' ).hasClass( 'BgBranco-noBorder' ) ){
        jQuery( 'body' ).addClass( '-whitebg' );
    }


    // Clicando no botão "Mostrar texto" nas sessões com texto descortinável
    jQuery( '.hiddentext .action' ).on( 'click', function() {
        var limiter = jQuery( this ).siblings( '.limiter' ),
        poslimiter = limiter.offset().top;
        limiter.toggleClass( '-expanded' );
        if ( ! limiter.hasClass( '-expanded' ) )
            jQuery( 'body,html' ).animate( { scrollTop: poslimiter }, 200 );
        return false;
    } );


    // botao mostrar todos os secretarios

    jQuery( '.wrapper.container.Secretarios' ).each( function() {
        var grid = jQuery( this ).find( '.grid-servidores' ),
            altura_inicial = 630,
            altura_total = grid.outerHeight(),
            pos_grid = grid.offset().top;

        grid.height( altura_inicial );

        jQuery( this ).find( '.delimitador .mostrar' ).on( 'click', function() {

            jQuery( this ).toggleClass( '-ativo' );

            if ( jQuery( this ).hasClass( '-ativo' ) ) {
                grid.height( altura_total );
                jQuery( this ).find( 'p' ).text( 'Recolher lista' );
                jQuery( this ).find( 'img' ).css( 'transform', 'rotate(180deg)' );
            } else {
                grid.height( altura_inicial );
                jQuery( 'html,body' ).animate( { scrollTop: pos_grid }, 300 );
                jQuery( this ).find( 'p' ).text( 'Veja lista completa' );
                jQuery( this ).find( 'img' ).css( 'transform', 'initial' );

            }
            return false;
        } )

    } );

    // esconde o menu ao clicar em qualquer lugar fora do menu
    jQuery( 'main' ).on( 'click', function() {
        jQuery( 'nav.wrapper ul#menu-principal li.-ativo' ).removeClass( '-ativo' );
    } );

    /***********************************
        JS - VELHO COMEÇA AQUI ???
        **********************************/

    // Mapa somente ao clicar

    jQuery(' .shade').click( function(){
        var map = jQuery(' .mapa');
        if ( map ) {
            if( !map.hasClass( 'active' ) ){
                map.addClass( 'active' );
            }else {
                map.removeClass( 'active' );
            }
        }
    })


    if ( ( !jQuery( 'body' ).hasClass( 'home' ) ) && ( !jQuery( 'header .menu .sub-menu:visible' ).length ) ) {
        jQuery( '.menu-principal-container .menu > .menu-governo' ).addClass( 'current-menu-item' );
        //para o menu do site-filho ficar com underline
        jQuery( '.site-filho .menu .current-menu-ancestor' ).addClass( 'current-menu-item' );
    }


    // Tratando submenu com âncoras
    jQuery( '.menu .js-ancora.current-menu-item .sub-menu' ).each( function () {
        var $doc = jQuery( 'html, body' );
        // Apenas âncoras da tela atual
        jQuery( '.current-menu-item', jQuery( this ) )
            // Classe pra gente saber que ele era "current"
            .addClass( 'initial-current' )
            // Desmarca todos
            .removeClass( 'current-menu-item' )
            // Marca o primeiro
            .first().addClass( 'current-menu-item' ).end()
            // Acha os links
            .find( 'a[href*="#"]' )
                // No click dos links
                .on( 'click', function () {
                    calcula_posicoes_de_ancoras();
                    // Pra onde a tela deve scrollar? (isso foi calculado na função "calcula_posicoes_de_ancoras")
                    var o_scroll_start = jQuery( this ).data( 'scroll-start' );

                    // Se não achou, scrolla pro começo da tela
                    if ( !o_scroll_start ) o_scroll_start = 0;
                    // Destino do link
                    var o_href = jQuery.attr( this, 'href' );
                    // Só o "hash" do destino (a parte depois do "#")
                    var o_hash = ( o_href.indexOf( '#' ) > -1 ) ? o_href.split( '#' ).pop() : '';
                    // Scrollando pro destino
                    if (!jQuery('body').hasClass('-fixed-menu')) {
                        o_scroll_start = o_scroll_start + 5;
                    }
                    $doc.animate( {
                        scrollTop: o_scroll_start
                    }, 500, function () {
                        // Ao terminar de scrollar, muda a URL
                        window.location.hash = o_hash;
                    } );
                    // Cancela a scrollada normal (brusca) do navegador, pra poder fazer nosso deslizamento suave
                    return false;
                } );

                jQuery( this ).append( "<li class='brasao'><img src='/wp-content/themes/ceara2016/assets/images/brasao-ceara.png' alt='Brasão do Estado do Ceará'></li>" )

                jQuery( this ).find('.brasao').click(function(){
                    jQuery( "html, body" ).animate({ scrollTop: 0 }, "slow");
                })
            } );
    // Ao mudar o tamanho da tela, recalculamos as posições das âncoras.
    // Este trigger "faz de conta" que já carregou e já scrollou,
    // incitando o navegador a já calcular as coisas, e exibir o menu fixo (se for o caso).
    jQuery( window ).on( 'load resize', calcula_posicoes_de_ancoras ).trigger( 'load scroll' );

    // Ao receber resposta de qualquer requisição ajax (e possivelmente mudar o tamanho da tela),
    // recalculamos também as posições das âncoras.
    jQuery( document ).ajaxSuccess( calcula_posicoes_de_ancoras );

    // JS do HEADER
    //Mostra e esconde o Menu do header mobile
    jQuery( '.mob-openmenu' ).click( function() {
        jQuery( '.logo + div' ).toggleClass( '-aberto' );
        jQuery( '.focus' ).toggleClass( '-ativo' );
        focus_addOpened( jQuery( '.logo + div' ), '-aberto')
    });

    //Mostra e esconde sub-menu da home casa civil
    jQuery( '.menu-openmenu' ).click( function() {
        jQuery( '.focus' ).toggleClass( '-ativo' );
        jQuery( this ).toggleClass( '-aberto' );
        focus_addOpened( this, '-aberto' );
    });

    // Adiciona a tarja laranja ao passar o mouse dos pais no sub-menu
    jQuery( '.menu-local' ).each( function() {
        jQuery( this ).find( '.menu .sub-menu' ).hover(
            function(){
                jQuery( this ).parent().addClass( '-ativo' );
            }, function(){
                jQuery( this ).parent().removeClass( '-ativo' );
            }
            );
    });


    // Adiciona a classe .-deselected ao menu-item que tenha a classe current-menu-item
    // que remove o ::After (setinha) do header ao passar o mouse em outro item do menu
    jQuery( '.main-header .menu > .menu-item' ).hover(function(){
        if (!jQuery( this ).hasClass( 'current-menu-item' )){
            // adiciona classe -deselected
            jQuery( '.main-header .menu > .current-menu-item' ).addClass( '-deselected' );
        };


    }, function(){
        // Remove a classe -deselected quando o mouse sai de cima do menu-item);
        jQuery( '.current-menu-item' ).removeClass( '-deselected' );

    });

    // Fecha quem estiver aberto ao clicar ná area do .focus
    jQuery( '.focus' ).click( function() {
        focus_close();
    })
    // fecha o que estiver aberto e atrelado ao focus
    jQuery(document).keyup(function(e){
        if (e.keyCode == 27) {
            focus_close();
        }
    });

    jQuery( '.menu-local .menu > *').addClass( 'menu-mobile' );
    var conteudo_menu = jQuery( '.menu-local .menu' ).clone().html();

    jQuery( '.logo + div .menu' ).prepend( conteudo_menu );

    // Mostra e esconde segundo nivel de items do menu
    // 828 é onde o header vira MOBILE
    if (jQuery( window ).width() < 828){

        jQuery( '.main-header .menu > .menu-item-has-children' ).delegate( '> a', 'click' , function() {
            if ( !jQuery( this ).parent().hasClass( '-ativo' ) ){
                jQuery( '.menu-item-has-children.-ativo' ).removeClass( '-ativo' );
            };

            jQuery( this ).parent().toggleClass( '-ativo' );
            jQuery( 'footer' ).scroll();
            return  false;
        })
    }

    // * mostrar esconder servidores *//
    jQuery(".content-escondido").each( function(){
        var height = jQuery( this ).find('.grid').outerHeight();
        jQuery( this ).height(height);


        jQuery(".mostrar").click(function(){
            if (jQuery( this ).attr('href') == "#" ) {
                jQuery( this ).parents(".content-escondido").toggleClass("-inativa");
                jQuery( this ).parents(".content-escondido").toggleClass("-ativa");
                jQuery( this ).parents(".delimitador").toggleClass("ativo");
                jQuery( this ).parents(".delimitador").hide();
                return false;
            }
        });

    });

    // Listagem de servidores em ordem aleatória
    jQuery('.listagem-servidores .grid ').randomize('.item');

    // Scroll para o topo
    jQuery( ".topo" ).click(function() {
        jQuery( "html, body" ).animate({ scrollTop: 0 }, "slow");
        return false;
    });

    // jQuery( '.hiddentext' ).each( function () {
    //     var h_title = jQuery( this ).data( 'title' );
    //     var h_subtitle = jQuery( this ).data( 'subtitle' );
    //     var a_mostrar = jQuery( '<a class="showhiddentext" title="Expandir/Contrair">' +
    //         ( h_title ? '<h5>' + h_title + '</h5>' : '' ) +
    //         ( h_subtitle ? '<p>' + h_subtitle + '</p>' : '' ) +
    //         '</a>' );
    //     a_mostrar.on( 'click', function () {
    //         jQuery( this ).toggleClass( 'expanded' ).prev( '.hiddentext' ).toggleClass( 'collapsed' );
    //     } );
    //     jQuery( this ).addClass( 'collapsed' ).after( a_mostrar );
    // } );

    // Tab Politicas de Incentivo
    jQuery( ".politicas-incentivo" ).each( function () {

        var menu = jQuery( '.politicas-incentivo .tab .menu' ),
        menuTab = jQuery(this).find(".tab .menu li"),
        conteudoTab = jQuery(this).find(".tab .conteudo");

        // Add ativo no primeiro indice do menu e do conteudo
        menuTab.find(".aba").first().addClass("ativo");
        conteudoTab.find(".content").first().addClass("ativo");
        // Arruma a height do menu caso não seja mobile
        if( jQuery(document).width() > 767 ){
            menu.height( conteudoTab.height() );
        };

        menuTab.click(function (){
            ativaTab(jQuery(this));
        });

        function ativaTab(aba){
            var data = aba.find(".aba").data("target");

            jQuery(".tab").find(".ativo").removeClass("ativo");
            // Adiciona a classa de ativo no menu da tab
            aba.find(".aba").addClass("ativo");

            jQuery(data).addClass("ativo");
            // Arruma a height do menu caso não seja mobile
            if( jQuery(document).width() > 767 ){
                menu.height( conteudoTab.height() );
            };
        }
    } );

    // Seção de "mais lidas" (com "data-json" apontando pra um JSON com as notícias mais lidas)
    jQuery( '.mais-lidas[data-json]' ).each( function () {
        var oMaisLidas = jQuery( this );
        var oGrid = jQuery( '.grid', oMaisLidas );
        // pega o modelinho
        var oModelo = oGrid.html();
        // e limpa o grid
        oGrid.html( '' );
        // busca as notícias
        jQuery.get( oMaisLidas.data( 'json' ), function ( data ) {
            var oContent = '';
          // pra cada notícia
          for ( var d = 0; d < data.length; d++ ) {
            var oItem = data[d];
                // insere os dados no modelinho
                oContent += oModelo.replace( '[numero]', '0' + ( d + 1 ) ).replace( '[link]', oItem.u ).replace( '[titulo]', oItem.t );
            }
            // põe o conteúdo no grid
            oGrid.html( oContent );
            // exibe a section
            oMaisLidas.parents( 'section[hidden]' ).prop( 'hidden', false );
        } );
    } );

    // Formulário que é submetido automaticamente ao clicar num input
    jQuery( 'form.form-auto-submit-on-change' ).each( function () {
        var oForm = jQuery( this );
        // esconde o botão de submit
        jQuery( 'input[type="submit"]', oForm ).remove();
        // ao marcar algum input checkbox ou radio, submete
        jQuery( 'input[type="checkbox"],input[type="radio"]', oForm ).on( 'change', function () {
            oForm.trigger( 'submit' );
        } );
        // ao clicar no input radio
        jQuery( 'input[type="radio"]', oForm ).on( 'click', function () {
            // se ele já estava selecionado, e se tem uma URL pra redirecionar ao "desselecionar"
            if ( ( oForm.data( 'pre-selected' ) == jQuery( this ).val() ) && oForm.data( 'unfiltered-url' ) ) {
                // redireciona
                location = oForm.data( 'unfiltered-url' );
            }
        } );
    } );
    // Formulário de filtrar aplicativos por categoria
    jQuery( 'form.form-aplicativos' ).each( function () {
        var oForm = jQuery( this );
        // Transforma o radio para checkbox
        jQuery( this ).find( 'label input' ).map( function(){
            jQuery( this ).attr( 'type' , 'checkbox' );
        });
        // Cancela os eventos de autosubmit...
        jQuery( 'input[type="radio"]', oForm ).unbind( 'click' );
        // ...e ao mudar o valor, filtra os aplicativos pelo atributo "data-cats"
        jQuery( 'input[type="checkbox"],input[type="radio"]', oForm ).unbind( 'change' ).on( 'change', function () {
            var search_cont = [];
            // monta a var usada para filtrar
            oForm.find( "input:checked" ).map( function(){
                search_cont.push( '[data-cats*="|' + jQuery( this ).val() + '|"]' )
            });
            // escondendo a mensagem "Nada encontrado"
            if ( oForm.siblings( 'h3.nenhuma-noticia:visible' ).length ) {
                oForm.siblings( 'h3.nenhuma-noticia' ).hide();
                oForm.siblings( 'p.nenhuma-noticia' ).hide();
            }
            // Filtra se tiver alguma coisa na var caso contrario mostra todas
            if ( search_cont.length ) {
                jQuery( 'section.servico-app div.box' ).hide().filter( search_cont.join( ',' ) ).show();
                // Testando se tem algum resultado
                if ( ! jQuery( 'section.servico-app div.box:visible' ).length ) {
                    // Criando mensagem "Nada encontrado" se não existir
                    if ( ! oForm.siblings( 'h3.nenhuma-noticia' ).length ) {
                        // Montando a mensagem de erro, data-no-items do formulário
                        var no_items = oForm.data( 'no-items' ),
                        nf_title = no_items.split( '|' )[0],
                        nf_desc = no_items.split( '|' )[1],
                        container = oForm.parent( '.container' ),
                        // Montando os elementos que serão apendados na tela
                        nf_title = jQuery( '<h3 class="sub-titulo nenhuma-noticia"/>' ).append( nf_title );
                        nf_desc = jQuery( '<p class="nenhuma-noticia"/>' ).append( nf_desc );
                        // Apendando elementos na tela
                        container.append( nf_title, nf_desc );
                    // Se a mensagem já existe
                } else {
                        // Mostrando as mensagens de erro
                        oForm.siblings( 'h3.nenhuma-noticia' ).show();
                        oForm.siblings( 'p.nenhuma-noticia' ).show();
                    }
                }
            } else {
                jQuery( 'section.servico-app div.box' ).show();
            }
        });
    } );

    // Teclado Virtual
    jQuery('#busca-ipt, #busca-ipt2').keyboard({
        layout: 'custom',
        openOn : null,
        display: {
            'bksp'   : 'Apagar',
            'enter'  : 'Enter',
            'normal' : 'ABC',
            'meta1'  : '.?123',
            'meta2'  : '#+=',
            'accept' : 'Escrever'
        },

        customLayout: {
            'normal': [
            '@ q w e r t y u i o p \' {bksp}',
            'a s d f g h j k l ç \^ \~ {enter}',
            '.com {s} z x c v b n m , . {s}',
            '{meta1} {space} {meta1} .br {accept}'
            ],
            'shift': [
            '@ Q W E R T Y U I O P \'  {bksp}',
            'A S D F G H J K L Ç \^ \~ {enter}',
            '.com {s} Z X C V B N M ! ? {s}',
            '{meta1} {space} {meta1} .br {accept}'
            ],
            'meta1': [
            '1 2 3 4 5 6 7 8 9 0 {bksp}',
            '- / : ; ( ) \u20ac & @ {enter}',
            '{meta2} . , ? ! \' " {meta2}',
            '{normal} {space} {normal} {accept}'
            ],
            'meta2': [
            '[ ] { } # % ^ * + = {bksp}',
            '_ \\ | ~ < > $ \u00a3 \u00a5 {enter}',
            '{meta1} . , ? ! \' " {meta1}',
            '{normal} {space} {normal} {accept}'
            ]
        },
        css: {
            // add dark themed class to keyboard popup
            // to use bright svg padlock icon
            popup : 'ui-keyboard-dark-theme'
        },
        restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
        preventPaste : true,  // prevent ctrl-v and right click
        autoAccept : true,


    }).addTyping();

    jQuery('#bt-open-keyboard').click(function(){
        var kb = jQuery('#busca-ipt, #busca-ipt2').getkeyboard();
        if ( kb.isOpen ) {
            kb.close();
        } else {
            kb.reveal();
        }
        return false;
    });

    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (!isOpera){
        // voice recorder
        try {
            var inp_speech = document.createElement( 'input' ).webkitSpeech;
            if ( inp_speech === undefined ) {
                if ( ( 'webkitSpeechRecognition' in window ) ) {
                    var recognition = new webkitSpeechRecognition();
                    //recognition.lang = "pt-BR";
                    jQuery( '#msg' ).append( '<i></i><i class="gravando">gravando</i>' );
                    recognition.onresult = function( event ) {
                        var texto = event[ 'results' ][ '0' ][ '0' ][ 'transcript' ];
                        jQuery( ' #busca-ipt ' ).val( texto ).text( texto );
                        texto = "";
                        if ( !texto ) {
                            jQuery( '#msg' ).removeClass( 'recording' );
                        }
                    }
                    jQuery( '#msg' ).click( function() {
                        var _this = jQuery( this );
                        if( _this.hasClass( 'recording' ) ){
                            recognition.stop();
                        } else {
                            recognition.start();
                        }
                        _this.toggleClass( 'recording' );
                    } );
                }
            }
        } catch( e ) {
            // void
        }
    }

    // Refine sua busca fixado ao topo
    // Função desativada a pedido do Ceará 25Jan2016

    // jQuery( '.busca-servico' ).each( function () {
    //     // Garante que o código só seja rodado no Desktop
    //     if ( jQuery( window ).width() > 1024 ){
    //         var target_busca = jQuery( this ),
    //             topBusca = target_busca.length ? target_busca.offset().top : 0;

    //         jQuery(window).scroll( function () {
    //             var target_lista = jQuery( '.resultado-busca:visible' ),
    //                 bottom = ( ( target_lista.outerHeight() + target_lista.offset().top ) - target_busca.height() );

    //             if( jQuery(window).scrollTop() >= topBusca ) {

    //                 target_busca.addClass( '-fixed' );

    //                 if ( jQuery(window).scrollTop() >= bottom ){
    //                     target_busca.removeClass( '-fixed' );
    //                     target_busca.addClass( '-fixed-bottom' );
    //                 }else {
    //                     target_busca.removeClass( '-fixed-bottom' );
    //                 }

    //             } else {

    //                 target_busca.removeClass( '-fixed' );

    //             }

    //         } );
    //     };
    // } );

    ////////////////////////////////////////////////////////
    /*Correção de posicionamento quando existe btn version*/
    ////////////////////////////////////////////////////////
    jQuery( '.btn-versao' ).each( function() {
        if( jQuery( document ).width() <= 1170 ){
            var first_element  =  jQuery( '.conteudo >:not(.btn-versao)' ).first();
            first_element.css('padding-top','130px');
        }
    });


    /******************************
        Dropdown Página Agenda
        ******************************/
        jQuery( '.calendario' ).each( function(){
            var dropdown = jQuery( '.calendario .ano-dropdown' ),
            dropdown_lis = jQuery( '.calendario .ano-dropdown .ano li' ) ;

            jQuery( '.mostrar-anos' ).click( function(){
                dropdown.toggleClass( '-ativo' );
                ano_irPara( null, dropdown_lis.index( jQuery('.selected') ) );
            });

            jQuery( '.ano-seguinte' ).click( function(){
                ano_irPara( 'seguinte' );
            });

            jQuery( '.ano-anterior' ).click( function(){
                ano_irPara( 'anterior' );
            });


            function ano_irPara( direction, pos ){
                selected = dropdown_lis.index( jQuery('.selected') );

                if( pos >= 0 ){
                    target = pos*60 <= 0 ? 0 : ( pos*60 )-60;
                    jQuery('.ano').animate({
                        scrollTop: target
                    }, 400);
                }
                else {
                    if( direction == 'seguinte' ){

                        if( jQuery( '.ano' ).find('.selected').next().length ){
                            jQuery( '.ano' ).find('.selected').removeClass( 'selected' ).next().addClass('selected');
                            selected = selected+1;
                        }else{
                            jQuery( '.ano' ).find('.selected').removeClass( 'selected' );
                            jQuery( '.ano li:first-child()').addClass( 'selected' );
                            selected = 0;
                        }

                        ano_irPara(null, selected );
                    }
                    if( direction == 'anterior' ){

                        if( jQuery( '.ano' ).find('.selected').prev().length ){
                            jQuery( '.ano' ).find('.selected').removeClass( 'selected' ).prev().addClass('selected');
                            selected = selected-1;
                        }else{
                            jQuery( '.ano' ).find('.selected').removeClass( 'selected' );
                            jQuery( '.ano li:last-child()').addClass( 'selected' );
                            selected = dropdown_lis.length;
                        }

                        ano_irPara(null, selected );
                    }
                }

            };

        });

    
    /******************************
        Popover Organograma
        ******************************/
        
       tippy('.popper-organograma', {
        onShow: function(instance) {
          var conteudo = jQuery(instance.reference).data('modal');
          var contentString = ''+
          '<div id="box-infos" class="box-infos">'+
            '<h3 class="box-titulo">'+conteudo.titulo+'</h4>'+
            '<h4 class="box-sub">'+conteudo.subtitulo+'</h4>'+
            '<div class="conteudo">'+conteudo.texto+'</div>'+
          '</div>';
          const content = this.querySelector('.tippy-content');
          content.innerHTML = contentString;
        },
        theme: 'casacivil',
        delay: 100,
        arrow: true,
        arrowType: 'round',
        size: 'large',
        trigger: 'click',
        animation: 'fade',
        zIndex: 1,
        interactive: true,
        performance: true,
        popperOptions: {
          modifiers: {
            offset: {
              offset: '-50%p + 18px' 
            }
          }
        }
      });

    /****** MEUS SERVIÇOS (localStorage) ******/
    var servico_temas = jQuery( '.antes-meuservicos' );
    // Se é a listagem de categorias de serviços
    if ( servico_temas.length ) {
        // Insere markup de 'Meus Serviços'
        var meus_id = 'meus', meus_cont = 0;
        while ( jQuery( '#' + meus_id + ( meus_cont ? '-' + meus_cont : '' ) ).length ) meus_cont++;
        meus_id = meus_id + ( meus_cont ? '-' + meus_cont : '' );
        servico_temas.after( '<section class="conteudo-base BgBranco-noBorder meus-servicos-js"><div class="wrapper container"><div class="top-services"><h3 class="titulo" id="' + meus_id + '">Meus Serviços </h3> <p><strong>Enquanto navega clique na estrela para <span>salvar</span> e acessar depois </strong></p> <div><a href="#" class="bt-salvar"><span>Salvar</span></a> <i class="seta"></i> <a href="#" class="bt-salvar bt-salvo"><span>Salvo</span></a></div></div>\
            <div class="dt-12  meus-servicos">\
            <ul class="row">\
            <li class="dt-4">\
            <div class="header">\
            </div>\
            <div class="content bgCinza">\
            <div class="action">\
            </div>\
            </div>\
            </li>\
            </ul>\
            </div></div></section>' );
        // Se tem algum serviço salvo
        if ( localStorage.servs ) {
            var servs = JSON.parse( localStorage.servs );
            // Pra cada serviço salvo
            jQuery.each( servs, function ( indice, valor ) {
                // Cria um markup esqueleto
                jQuery( '.meus-servicos-js .row .dt-4:last' ).after( '<li class="dt-4 --serviceid -carregando" data-serviceid="' + valor + '">\
                    <div class="conteudo"><div class="header">\
                    <a href="?sid=' + valor + '"><h2>Carregando...</h2></a>\
                    </div>\
                    <div class="content">\
                    <a href="?sid=' + valor + '">\
                    <h3>Carregando...</h3>\
                    </a>\
                    </div></div>\
                    <div class="action">\
                    <a class="detalhes" href="?sid=' + valor + '"> DETALHES </a>\
                    </div>\
                    </li>' );
                // E faz uma requisição ajax pra preencher o esqueleto
                jQuery.get( jQuery( 'body' ).data( 'ajaxurl' ), { 'action': 'get_servico', 'servid': valor }, function ( data ) {
                    var servid = data.id;
                    var servico = jQuery( '.meus-servicos-js .row .dt-4[data-serviceid="' + servid + '"]' );
                    servico.removeClass( '-carregando' );
                    servico.find( 'h2' ).html( data.categoria_nome );
                    servico.find( '.content h3' ).html( data.titulo );
                } );
            } );
        }
        jQuery( '.meus-servicos-js .row .dt-4:first').remove();
    }
    // Cria o botão-modelo de "salvar serviço"
    var bt_salvar = jQuery( '<a href="#" class="bt-salvar"></a>' ).on( 'click', function () {
        // ID do serviço
        var sid = jQuery( this ).parents( '.--serviceid' ).data( 'serviceid' );
        // Lê serviços salvos
        var servs = localStorage.servs || '[]';
        servs = JSON.parse( servs );
        // Se é pra salvar
        if ( !jQuery( this ).hasClass( 'bt-salvo' ) ) {
            // Muda o botão pra "salvo"
            jQuery( this ).addClass( 'bt-salvo' ).trigger( 'changeClass' );
            // Salva o ID no array
            if ( jQuery.inArray( sid, servs ) == -1 ) servs.push( sid );
        // Se é pra remover
    } else {
            // Muda o botão pra "salvar"
            jQuery( this ).removeClass( 'bt-salvo' ).trigger( 'changeClass' );
            // Arranca o ID do array
            var s_ind = jQuery.inArray( sid, servs );
            if ( s_ind > -1 ) servs.splice( s_ind, 1 );
        }
        // Salva o array no localStorage
        localStorage.servs = JSON.stringify( servs );
        return false;
    // Ao trocar classe (salvar/remover)
} ).on( 'changeClass', function () {
        // Textos padrão
        var save_str = "SALVAR";
        var remove_str = "REMOVER";
        // Se for aquelas caixinhas cinzas, é outro texto
        if ( jQuery( this ).parents( '.--serviceid' ).hasClass( 'boxListagem' ) ) {
            save_str = "ADICIONAR AOS MEUS SERVIÇOS";
            remove_str = "SERVIÇO SALVO";
        }
        // Muda o texto
        jQuery( this ).html( '<span>' + ( jQuery( this ).hasClass( 'bt-salvo' ) ? remove_str : save_str ) + '</span>' );
    } );
    // Espalha clones deste botão-modelo nos lugares necessários
    jQuery( '.meus-servicos .detalhes, .lista-servicos .detalhes, .menu-breadcrumb.--serviceid .pagina, #servicos .boxListagem .bar .info ' ).after( bt_salvar.clone( true ) );
    // Se tem algum serviço salvo
    if ( localStorage.servs ) {
        // Lê serviços salvos
        var servs = localStorage.servs || '[]';
        servs = JSON.parse( servs );
        // Pra cada serviço salvo
        jQuery.each( servs, function ( indice, valor ) {
            // Procura seu botão "salvar" correspondente e já muda pra "salvo"
            jQuery( '.--serviceid[data-serviceid="' + valor + '"] .bt-salvar' ).addClass( 'bt-salvo' );
        } );
    }
    // Arruma o texto de todos os botões salvar
    jQuery( '.bt-salvar' ).trigger( 'changeClass' );

    /***** Filtros de serviços (webservice) por "secretaria" *****/
    jQuery( 'a[data-filtrasecretaria]' ).on( 'click', function () {
        var secs = [];
        jQuery( '.--filtro-servicos a.selecionado' ).each( function () {
            secs.push( jQuery( this ).data( 'filtrasecretaria' ) );
        } );
        var a_sec = jQuery( this ).data( 'filtrasecretaria' );
        var a_lista = jQuery( '.lista-servicos' );
        var o_filtro = jQuery( '.--filtro-servicos a[data-filtrasecretaria="' + a_sec + '"]' );
        if ( !o_filtro.hasClass( 'selecionado' ) ) {
            secs.push( a_sec );
            o_filtro.addClass( 'selecionado' );
        } else {
            var acha_sec = jQuery.inArray( a_sec, secs );
            if ( acha_sec > -1 ) secs.splice( acha_sec, 1 );
            o_filtro.removeClass( 'selecionado' );
        }
        secs = jQuery.unique( secs );
        if ( secs.length ) {
            var o_seletor = '.tabela a[data-filtrasecretaria="' + secs.join( '"], .tabela a[data-filtrasecretaria="' ) + '"]';
            jQuery( '.tabela', a_lista ).hide().addClass( '--filtrado' );
            jQuery( o_seletor, a_lista ).each( function () {
                jQuery( this ).parents( '.tabela' ).show().removeClass( '--filtrado' );
            } );
            jQuery( '.lista-servicos .veja-mais' ).hide();
        } else {
            jQuery( '.tabela', a_lista ).show().removeClass( '--filtrado' );
            jQuery(' .lista-servicos .tabela' ).each( function(){
                var hide = jQuery( this ).attr('hidden');
                if( hide ){
                    jQuery( this ).hide();
                }
            })
            jQuery( '.lista-servicos .veja-mais' ).show();
        }
        // Posiciona a tela no inicio da lista após receber o filtro
        if ( jQuery( window ).width() > 1024 ){
            jQuery( window ).scrollTop( ( a_lista.offset().top ) - 40 );
            return false;
        }
    } );

    /**** Atualiza mapa do endereço do serviço (single serviço ) *****/
    jQuery( '.--carrega-mapa' ).css( 'cursor', 'pointer' ).on( 'click', function () {
        var o_mapa = jQuery( this ).parents( '.SingleServico' ).find( '.mapa iframe' );
        o_mapa.prop( 'src', o_mapa.data( 'basesrc' ) + encodeURIComponent( jQuery( this ).text() ) );
    } );

    /******************************
    modal multimidia
    ******************************/
    jQuery( '.CearaMultimidia:first .galeria' ).each( function(){
        var multimidia = jQuery( this );
        // fechar o modal
        jQuery( '.modal-multimidia .-fechar' ).on( 'click', function() {
            jQuery( '.Overlay, .modal-multimidia' ).removeClass( '-ativo' );
        });

        // click nas propagandas
        multimidia.find( 'a.sem-modal' ).on( 'click', function(){
            return false;
        });

        // click nas imagens que tem modal
        multimidia.find( 'a.tem-modal' ).on( 'click', function(){
            var galeria_video = jQuery( '.modal-multimidia .galeria-video' ),
                galeria_podcast = jQuery( '.modal-multimidia .galeria-podcast' ),
                data_type = jQuery( this ).data( 'type' ),
                clicked = jQuery( this );

            // Adiciona a classe do tipo do modal, que esconde os modais fechados
            jQuery( '.modal-multimidia' ).attr( 'class', 'modal-multimidia' ).addClass( '-' + data_type );

            // Reseta html Podcast e Videos
            if( galeria_podcast.hasClass( 'slick-initialized' ) ){
                galeria_podcast.slick( 'unslick' );
            };
            galeria_podcast.html( '' );

            if( galeria_video.hasClass( 'slick-initialized' ) ){
                galeria_video.slick( 'unslick' );
            };
            galeria_video.html('');

            // Descobre o tipo de elemento que será exibido no modal
            switch( data_type ){
                case 'foto':
                    modal_fotos( clicked );
                    break;
                case 'video':
                    modal_videos( clicked, galeria_video );
                    break;
                case 'podcast':
                    modal_podcasts( clicked, galeria_podcast );
                    break;
                default:
                    return false;
            }

            // Abre o modal
            jQuery( '.Overlay , .modal-multimidia' ).addClass( '-ativo' );

            return false;
        });

        // click nos botões de destaque da galeria multimidia
        jQuery( '.CearaMultimidia .legenda .tem-modal' ).on( 'click', function() {
            var data_type = jQuery( this ).data( 'type' ),
                clicked = jQuery( '.galeria a.tem-modal[data-type="' + data_type + '"]:first' ),
                galeria_video = jQuery( '.modal-multimidia .galeria-video' ),
                galeria_podcast = jQuery( '.modal-multimidia .galeria-podcast' );

            // Adiciona a classe do tipo do modal, que esconde os modais fechados
            jQuery( '.modal-multimidia' ).attr( 'class', 'modal-multimidia' ).addClass( '-' + data_type );

            // Reseta html Podcast e Videos
            if ( galeria_podcast.hasClass( 'slick-initialized' ) ) {
                galeria_podcast.slick( 'unslick' );
            }
            galeria_podcast.html( '' );

            if ( galeria_video.hasClass( 'slick-initialized' ) ) {
                galeria_video.slick( 'unslick' );
            }

            galeria_video.html('');

            switch( data_type ) {
                case 'foto':
                    modal_fotos( clicked );
                    break;
                case 'video':
                    modal_videos( clicked, galeria_video );
                    break;
                case 'podcast':
                    modal_podcasts( clicked, galeria_podcast );
                    break;
                default:
                    return false;
            }

            // Abre o modal
            jQuery( '.Overlay , .modal-multimidia' ).addClass( '-ativo' );

            return false;
        } );


        function modal_fotos( clicked ) {
            var imgs_filtradas = get_imgs( 'foto' ),
                alt_imgs = get_alts( 'foto' ),
                slick_principal = jQuery( '.modal-multimidia .galeria-fotos .galeria' ),
                slick_navegacao = jQuery( '.modal-multimidia .galeria-fotos .galeria-nav' ),
                qtd_imgs = imgs_filtradas.length,
                clicked_img = clicked.find( 'img' ),
                start_pos = 0,
                playSpeed = 2800;

            // Salva de alguma forma o href do pai <a> no filho <img>
            imgs_filtradas.each( function () {
                jQuery( this ).data( 'link-href', jQuery( this ).parents( 'a' ).attr( 'href' ) );
            } );

            // Clona <img>s (agora eles são órfãos)
            var imgs_reescritas = imgs_filtradas.clone( true );
            // Varre os clones
            imgs_reescritas.each( function () {
                // Salva de alguma forma o src original
                var o_src = jQuery( 'img', this ).attr( 'src' );
                jQuery( 'img', this ).attr( 'data-thumb-src', o_src );
                // Se herdou um href do pai
                var o_href = jQuery( this ).data( 'link-href' );
                // Troca o src pelo href herdado do pai
                if ( o_href ) jQuery( 'img', this ).attr( 'src', o_href );
            } );

            // Só inicia o slick caso ele não esteja iniciado
            if( !slick_principal.hasClass( 'slick-initialized' ) ){
                // Remove qualquer coisa dentro das miniaturas de navegação e adiciona as imagens originais
                slick_navegacao.html('').append( imgs_filtradas.clone() );
                // Remove qualquer coisa dentro do slick e adiciona as imagens clonadas
                slick_principal.html('').append( imgs_reescritas );
                // console.log( imgs_reescritas );

                // Inicia os Slicks
                slick_principal.slick({
                    variableWidth: true,
                    centerMode: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplaySpeed: playSpeed,
                    dots: false,
                    centerPadding: '0px',
                    centerMode: true,
                    infinite: true,
                    asNavFor: '.modal-multimidia .galeria-fotos .galeria-nav'
                }).on('afterChange', function(event, slick, currentSlide, nextSlide){
                    jQuery( '.galeria-fotos .contador' ).html(
                        '<p>'+
                        '<span>'+
                        (currentSlide+1) +
                        '</span>'+
                        ' / ' + qtd_imgs +
                        '</p>' );
                    // Imprime o alt da imagem
                    jQuery( '.galeria-fotos .legenda' ).html( '<p>' + alt_imgs[ currentSlide ] + '</p>' );
                    // faz as setas do teclado funcionarem no slick principal
                    slick_principal.find('.slick-list').attr('tabindex', 0).focus();
                });

                slick_navegacao.slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    asNavFor: '.modal-multimidia .galeria-fotos .galeria'
                });

                jQuery( '.modal-multimidia .-fullscreen' ).on( 'click', function(){
                    // start_pos = slick_principal.find( '.slick-current' ).data( 'slick-index' );
                    toggleFullScreen();
                    jQuery( '.galeria-fotos' ).toggleClass( '-fullscreen' );
                    // slick_principal.slick('slickGoTo', start_pos);
                });

                jQuery( '.modal-multimidia .play' ).on( 'click', function(){
                    var action = jQuery( this ).hasClass('-pausado') == false ?
                    'slickPause' :
                    'slickPlay',
                    button = jQuery( this );
                    // da Play ou Pause no Slick Princinpal
                    slick_principal.slick( action );
                    // Remove a classe do botao para mostrar o icone do estado
                    if( action == 'slickPause' ){
                        button.addClass( '-pausado' );
                    }else{
                        button.removeClass( '-pausado' );
                    }
                });

            }

            // determina em qual slide o slick começa (usando o src da imagem original)
            // start_pos = clicked_img.length > 0 ? slick_principal.find( 'img[data-link-href="' + clicked_img.attr( 'src' ) + '"]' ).parent( '.slick-slide' ).filter( ':not( .slick-cloned )' ).data('slick-index') : 0;

            var start_pos = clicked.length ? jQuery( 'figure.tem-modal:has(a[data-type="foto"])' ).index( clicked.parents( 'figure' ) ) : 0;
            // Manda o Slick para foto clicada
            slick_principal.slick('slickGoTo', start_pos);

        };

        function modal_videos( clicked, galeria_video ){
            var imgs_filtradas = get_imgs( 'video' ),
            clicked_img = clicked.find( 'picture img' );


            // Resetando slicks ligados
            if( galeria_video.hasClass( 'slick-initialized' ) ){
                galeria_video.slick( 'unslick' );
            };
            imgs_filtradas.map( function(){
                galeria_video.append(
                    '<iframe allowfullscreen="allowfullscreen" data-src="https://www.youtube.com/embed/' + jQuery( this ).parent().data('url') + '" src="https://www.youtube.com/embed/' + jQuery( this ).parent().data('url') + '"></iframe>'
                    );
            });

            // Só monta slick se tiver videos suficientes
            if( imgs_filtradas.length > 1 ){

                galeria_video.slick( {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    centerPadding: '0px',
                    centerMode: true,
                    infinite: true
                } ).on( 'afterChange', function( event, slick, currentSlide ) {
                    galeria_video.find( 'iframe:not(.slick-current)' ).each( function() {
                        jQuery( this ).attr( 'src', '' ).attr( 'src', jQuery( this ).data( 'src' ) );
                    } );
                } ) ;

                start_pos = galeria_video.find( '[data-src="https://www.youtube.com/embed/'+clicked.data('url')+'"]' ).filter( ':not( .slick-cloned )').data('slick-index');

                galeria_video.slick( 'slickGoTo', start_pos );

            }
        };

        function modal_podcasts( clicked, galeria_podcast ){
            var imgs_filtradas = get_imgs( 'podcast' );

            // Resetando slicks ligados
            if( galeria_podcast.hasClass( 'slick-initialized' ) ){
                galeria_podcast.slick( 'unslick' );
            };

            imgs_filtradas.map( function(){
                var legenda = jQuery( this ).parents( 'figure' ).find( 'figcaption p' ).html();
                galeria_podcast.append(
                    '<div class="slide">'+
                    '<div class="legenda"><p>' + legenda + '</p></div>' +
                    '<audio controls="controls">'+
                    '<source src="'+ jQuery( this ).parent().data('url') +
                    '" type="audio/mpeg">'+
                    'Seu Navegador não tem suporte para reprodução de audio<br>você pode fazer o donwload e ouvir em um player de sua preferência<a href="'+ jQuery( this ).parent().data('url') +
                    '">clicando aqui</a>'+
                    '</audio>'+
                    '</div>'
                    )

            });

            if ( imgs_filtradas.length > 1 ) {
                galeria_podcast.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    centerPadding: '0px',
                    centerMode: true,
                    fade: false,
                    infinite: true
                }).on( 'afterChange', function( event, slick, slickCurrent ) {
                    galeria_podcast.find( 'audio' ).each( function () {
                        this.pause();
                    } );
                } );



                start_pos = galeria_podcast.find( '[src="'+clicked.data('url')+'"]' ).parents( '.slick-slide').filter( ':not( .slick-cloned )').data('slick-index');

                galeria_podcast.slick( 'slickGoTo', start_pos );

            }
        };

        // Retorna as imagens que tem um determinado data-type
        function get_imgs( data_type ){
            return( multimidia.find( 'a[data-type="' + data_type + '"]').find( 'img' ) );
        }

        function get_alts( data_type ){
            var alt_img = [];
            multimidia.find( 'a[data-type="'+data_type+'"]:not(ul li a) .legenda p' ).map( function(){
                alt_img.push( jQuery(this).html() );
            });
            return alt_img;
        }

    });


    // Clique nos botões "Informações Úteis - Sim|Não"
    jQuery( '.--info-uteis a.button' ).on( 'click', function() {
        var pai_info = jQuery( this ).parents( '.--info-uteis' );
        if ( !pai_info.hasClass( '--carregando-ajax' ) ) {
            pai_info.addClass( '--carregando-ajax' ).html( '<p class="loading">Carregando...</p>' );
            var voto = jQuery( this ).hasClass( '--btn-sim' ) ? 's' : 'n',
            serviceid = jQuery( '.--serviceid' ).data( 'serviceid' ),
            url_rating = jQuery( this ).parents( '.--info-uteis' ).data( 'uri' );
            serviceid = serviceid ? parseInt( serviceid ) : 0;
            jQuery.post( url_rating, { 'voto' : voto, 'id': serviceid }, function( data ) {
                pai_info.fadeOut( function () {
                    jQuery( this ).removeClass( '--carregando-ajax' ).html( '<strong>Obrigado por responder!</strong>' ).fadeIn();
                } );
            } );
        }
        return false;
    } );


    // Corrige descobre o tamanho ideal da Agenda do governador
    jQuery( '.noticias-principais-variada' ).each( function(){
        var noticia_principal = jQuery( this )
        set_agendaheight( noticia_principal );

        // Chama a Função se sofrer resize
        jQuery( window ).resize(function(){
            set_agendaheight( noticia_principal );
        });
    });

    // box verdes com links
    jQuery(' .projetos-acoes-variado .box ').click( function(){
        var mod = jQuery( this ).data('modal');
        if ( mod ){
            modal_content_toggle();
            jQuery( this ).parents(' .item ').find(' .modal-content ').addClass('active');
            return false;
        }
    } );

    jQuery(' .modal-mask, .modal-mask .modal-close ').click( function(){
        jQuery(' .has-modal .modal-content ').removeClass(' active ');
        modal_content_toggle();
        return false;
    } );

    // Video Play Home multisite

    jQuery('.modulo-video-noticias .btn-play').click( function(){
        var vc = jQuery( this ).parents('.video-container');
        var src = vc.find('.video-frame').data('src');
        vc.find('.video-frame').attr('src',src);
        vc.addClass('playing');

        return false;
    } );

    jQuery( '.modulo-video-noticias .video-container' ).on( 'click', function () {
        if ( jQuery( this ).hasClass( '-pausado' ) ) jQuery( '.--social-link-ao-vivo', jQuery( this ).parents( '.modulo-video-noticias' ) ).trigger( 'click' );
        return false;
    } );

    jQuery( '.modulo-video-noticias .--social-link-ao-vivo' ).on( 'click', function () {
        var o_modulo = jQuery( this ).parents( '.modulo-video-noticias' );
        var o_icone = jQuery( this ).children( 'img' ).attr( 'src' );
        var o_container = jQuery( '.video-container', o_modulo );
        var o_frame = jQuery( '.video-frame', o_container );
        var o_src = o_frame.attr( 'src' );
        var o_data_src = o_frame.data( 'src' );
        if ( o_src ) {
            o_frame.data( 'src', o_src );
            o_frame.attr( 'src', '' );
            o_container.addClass( '-pausado' );
            jQuery( this ).children( 'img' ).attr( 'src', o_icone.replace( 'aovivo-icon.png', 'aovivo-pausado-icon.png' ) );
            return true;
        } else {
            o_frame.attr( 'src', o_data_src );
            o_frame.data( 'src', false );
            o_container.removeClass( '-pausado' );
            jQuery( this ).children( 'img' ).attr( 'src', o_icone.replace( 'aovivo-pausado-icon.png', 'aovivo-icon.png' ) );
            return false;
        }
    } );
    jQuery(' .resolution-controll ').click( function(){
        var mv = jQuery( this ).parents('.modulo-video');

        jQuery(' body ').toggleClass('fullscreen');
        //toggleFullScreen();
        var text = jQuery( this ).text();
        jQuery( this ).text( text == "Minimizar" ? "TELA CHEIA" : "Minimizar" );

        return false;
    } );

    // clique no botão Veja Mais na tela de serviços
    jQuery( '.temas-servicos .listagemBuscaServico .veja-mais button' ).click( function () {
        var lista = jQuery( this ).parents( '.listagemBuscaServico' ),
            ppp = jQuery( this ).data( 'ppp' ); // qtd por página
            lista.find( '.SuperHidden:lt(' + ppp + ')' ).removeClass( 'SuperHidden' );
            if ( ! lista.find( '.SuperHidden' ).length ) {
                jQuery( this ).hide();
            }
        } );



    if ( jQuery('.release-material').length ) {

        var caixas = jQuery('.release-material .caixa');

        caixas.each(function(){
            var link = jQuery(this).find('a');
            var texto = jQuery(this).find('.acao img').attr('alt');
            if ( texto == "icone audio" ) {
                jQuery(this).after('<audio controls="controls" style="display:none;"> Your browser does not support the <code>audio</code> element. <source src="'+link.attr('href')+'"> </audio>');
                link.click(function(){
                    link.parents('.caixa').next().fadeToggle();
                    return false;
                })
            }

        });
    }

    // Link para abrir modal (espera-se que o atributo "href" seja o id do elemento com o conteúdo do modal)
    jQuery( '.--has-modal' ).on( 'click', function () {
        var link_dest = jQuery( this ).attr( 'href' );
        if ( link_dest.indexOf( '#' ) == 0 ) {
            link_dest = jQuery( link_dest );
            if ( link_dest.length ) {
                link_dest.toggleClass( 'SuperHidden' );
                return false;
            }
        }
    } );

} );


function modal_content_toggle(){
    jQuery(' body ').toggleClass('fullscreen');
    jQuery(' .modal-mask ').toggleClass(' active ');
}



// Clique no botão "veja mais" do módulo Todas as notícias.
jQuery('.cc-all-posts-module button.cc-button').click( function() {

    // Referência do botão clicado
    var cc_button = jQuery(this);

    // Classes para o ícone do botão
    var iconNormal = "fas fa-chevron-down";
    var iconLoading = "fas fa-spinner fa-pulse";
    
    // Página atual exibida
    var current_page = typeof cc_button.data('current-page') === "undefined" ? 1 : cc_button.data('current-page');
    var next_page = current_page + 1;

    // Número de posts a serem retornados
    var posts_per_page = cc_button.data( 'posts-per-page' );

    // Número da categoria
    var category_id = cc_button.data( 'category-id' );

    // URL da API
    var api_url = jQuery( 'link[rel="https://api.w.org/"]' ).attr( 'href' );

    // Verifica se a API está ativada
    if ( api_url ) {
        // Desativa o botão e adiciona uma animação no ícone indicando
        // início do carregamento de mais notícias.
        cc_button
            .attr('disabled', 'disabled')
            .children('i')
            .removeClass()
            .addClass(iconLoading);

        // URL da consulta
        var cons_url = api_url + 'wp/v2/posts/?_embed&orderby=date&per_page='+ posts_per_page +'&page=' + next_page;

        if(category_id) {
            cons_url = cons_url + "&categories=" + category_id;
        }
        // Realiza a chamada para a API
        jQuery.get(cons_url, function(posts, status, response) {
            // Verifica se algum post foi retornado
            if (posts) {
                // Padroniza os posts
                posts = posts.map(function(post) {
                    // Recebe o id do post
                    var post_id = post["id"];
                    
                    // Recebe o nome da categoria do post
                    var post_categories = post["_embedded"]["wp:term"][0];
                    var post_category = post_categories[0]["name"];

                    // Recebe a data do post
                    var month_names = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ];
                    var post_date = new Date(post["date"]);
                    var day = post_date.getDate();
                    var month_index = post_date.getMonth();
                    var year = post_date.getFullYear();
                    var addzero = function( el ){ el < 10? el = '0'+el: el; return el; }
                    var hours = addzero(post_date.getHours());
                    var minutes = addzero(post_date.getMinutes());
                    post_date = day + ' DE ' + month_names[month_index] + ' DE ' + year + ' - ' + hours + ':' + minutes;

                    // Recebe o link do post
                    var post_link = post["link"];

                    // Recebe o título do post
                    var post_title = post["title"]["rendered"];

                    // Recebe o resumo do post
                    var post_excerpt = post["excerpt"]["rendered"];
                    post_excerpt = post_excerpt.trim().replace(/\[.+\]/g, '');
                    post_excerpt = post_excerpt.replace(/<[^>]*>?/gm, '');
                    post_excerpt = post_excerpt.split(" ");
                    if(post_excerpt.length >= 55) {
                        post_excerpt = post_excerpt.splice(0, 55).join(" ");
                        post_excerpt += " [...]";
                    } else {
                        post_excerpt = post_excerpt.join(" ");
                    }

                    // Retorna o post padronizado
                    return {
                        id: post_id,
                        category: post_category,
                        date: post_date,
                        link: post_link,
                        title: post_title,
                        excerpt: post_excerpt
                    };
                });

                // Gera o html de cada post e incrementa na página
                posts.forEach(function(post) {
                    var post_html = '';
                    post_html += '<div class="row cc-post">';
                    post_html += '    <div class="col-12 cc-post-metas">';
                    post_html += '        <span class="cc-post-metas-category">'+ post.category +'</span>';
                    post_html += '        <span class="cc-post-metas-separator d-none d-sm-inline"> | </span>';
                    post_html += '        <span class="cc-post-metas-date d-block d-sm-inline">' + post.date +'</span>';
                    post_html += '    </div>';
                    post_html += '    <div class="col-12">';
                    post_html += '        <div class="row cc-post-content">';
                    post_html += '            <div class="col-12 col-sm-5">';
                    post_html += '                <a class="cc-post-title" href="'+ post.link +'">';
                    post_html += '                    <h3>'+ post.title +'</h3>';
                    post_html += '                </a>';
                    post_html += '            </div>';
                    post_html += '            <div class="col-12 col-sm-7 mt-3 mt-sm-0">';
                    post_html += '                <div class="cc-post-excerpt">'+ post.excerpt +'</div>';
                    post_html += '            </div>';
                    post_html += '        </div>';
                    post_html += '    </div>';
                    post_html += '    <div class="col-12">';
                    post_html += '        <hr class="cc-divider">';
                    post_html += '    </div>';
                    post_html += '</div>';
                    
                    // Incrementa o post na página
                    jQuery(".cc-all-posts-module .cc-posts").append(post_html);
                });
                cc_button.data('current-page', next_page);
    
                // Recebe o total de notícias cadastradas do header
                var totalPages = response.getResponseHeader('X-WP-TotalPages');
    
                // Verifica se há mais noticias a serem buscadas
                if (next_page >= totalPages) {
                    // Remove o botão pois não há mais noticias para buscar
                    jQuery(".cc-all-posts-module .cc-actions").remove();
                } else {
                    // Reseta o estado do botão
                    cc_button
                        .attr( 'disabled', false )
                        .children('i')
                        .removeClass()
                        .addClass(iconNormal);
                }
            }
        }, "json");
    } else {
        alert("No momento não é possível executar esta operação. Por favor, tente novamente mais tarde.");
    }

    return false;
});


// Adiciona para o data opened da classe .focus
// qual classe provavelmente está aberta para ser fechado posterirmente
function focus_addOpened ( opened, togClass ) {
    // Pega a primeira classe de quem foi clicado
    var opened = jQuery( opened ).attr( 'class' ).split( (' ') [0] );
    // Garante que .focus esteja sempre vazio para receber outro data
    jQuery( '.focus' ).data( 'opened', '' );
    // Adiciona a primeira classe para o data do .focus
    jQuery( '.focus' ).data( 'opened', opened[0] );
    jQuery( '.focus' ).data( 'togClass', togClass );
}

// Fecha oq estiver aberto  ao clicar na área do .focus
// Tomando como base o valor do data-opened ou
// manualmente passando a classe na chamada da função
function focus_close( opened, togClass ){
    if ( !opened ) opened = 0;
    if ( !togClass ) togClass = 0;
    if ( opened == 0 && togClass == 0){
        // caso não seja enviado valor para o data
        var opened = '.'+jQuery( '.Overlay' ).data( 'opened' ),
        togClass = jQuery( '.focus' ).data( 'togClass' );

        jQuery( opened ).removeClass( togClass );
        jQuery( '.focus' ).removeClass( '-ativo' );
    }
    else{
        // caso tenha necessidade, funciona passando valores manuais
        jQuery( opened ).removeClass( togClass );
        jQuery( '.focus' ).removeClass( '-ativo' );
    }
}

jQuery( '.economia-regiao' ).each( function() {
    var o_bloco = jQuery( this ).find( '.bloco' ),
    mapasrc = jQuery( '.mapa iframe' ).attr('src');
    //Corrige o tamanho do bloco
    set_blocoheigh( o_bloco );
    //Determina o click das lista de cidades
    jQuery(".economia-regiao .lista li > a").click(function(){
        var id = jQuery( this ).attr('href'),
        src = jQuery( this ).data('mapsrc');
        info_altura = jQuery(".economia-regiao "+id+"").height();
        // Corrige a altura da lista para o conteúdo da lista
        if( jQuery( document ).width() < 801 ){
            o_bloco.height( info_altura );
        }
        // Remove o inativo e exibe as informacoes da cidade
        jQuery(".economia-regiao "+id+"").removeClass('inativo');
        // Muda o mapa para a cidade clicada
        jQuery( '.mapa iframe' ).attr('src',src);

        return false;
    });

    // Determina os clicks das informacoes das cidades
    jQuery(".economia-regiao .informacaos .header").click(function(){
        var o_pai = jQuery( this ).parent();
        // volta para o mapa antigo
        jQuery( '.mapa iframe' ).attr( 'src', mapasrc );
        // Esconde as infos da cidade
        o_pai.addClass( 'inativo' );
        // Corrige a altura do bloco
        set_blocoheigh( o_bloco );
    });

    // Função que corrige a altura do bloco com base no número de cidades que ele exibe
    function set_blocoheigh( o_bloco ){
        var lista_heigh = o_bloco.find( '.lista' ).outerHeight();
        if( jQuery( document ).width() < 801 ){
            o_bloco.height( lista_heigh );
        }
        return false;
    };
});
// Toggle Tab Politicas de Incentivo
function ativaTab(aba){

    var data = aba.find(".aba").data("target");

    jQuery(".tab").find(".ativo").removeClass("ativo");
    // Adiciona a classa de ativo no menu da tab
    aba.find(".aba").addClass("ativo");

    jQuery(data).addClass("ativo");
}
// Liga e Desliga o FullScreen do navegador
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  }
} else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
  } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
  }
}
}

// // Esconde a Barra de rolagem de um elemento com scroll
// function esconde_scroll( target ){
//     w_children  = target.children().width();

//     target.width( ( target.width() - w_children ) + target.width() );

//     return true;
// }

function sugestao_wpcf7_sent_ok () {
    jQuery( '.modal-confirmacao' ).fadeIn();
    jQuery( '.wpcf7-mail-sent-ok' ).remove();
}


// Função que aplica o height ideal da agenda
function set_agendaheight( noticia_principal ){
    if( jQuery( window ).width() > 904 ){
        var a_noticia = noticia_principal.find( '.esquerda' ),
        a_agenda = noticia_principal.find( '.direita' ),
        conteudo_agenda = a_agenda.find( '.corpo' );
        o_padding = conteudo_agenda.outerHeight() - conteudo_agenda.height(),
        height_ideal = a_noticia.height() - ( a_agenda.find( '.header' ).outerHeight() + o_padding );
        if( height_ideal > 0 ){
            conteudo_agenda.height( height_ideal );
        }
    }
    return true;
}



function clonesServicos(){
    if(jQuery(window).outerWidth(true) <= 768){
        //ativa no clique
        jQuery('.caixa .header').click(function(){
            //Abre fecha
            jQuery('.caixa .action a').toggle();

            //procura, adiciona e remove a class de estilo
            if(jQuery(this).hasClass('-actionMobile')){
                jQuery(this).removeClass('-actionMobile');
            }else{
                jQuery(this).addClass('-actionMobile');
            }
        });


        //Mudando Não encontrou o que procura

        // Copiando o markup
        var cloneAlerta = jQuery('.busca-servico').clone();

        // Remove o Feedback do topo
        jQuery('.busca-servico').each(function() {
            jQuery(this).find('.alerta').remove();
            jQuery(this).find('.modal-feedback').remove();
            jQuery(this).find('.modal-confirmacao').remove();

            // Adiciona html ao fim da pagina
            jQuery('<div class="busca-servico -end"> </div>').appendTo('#main > .container');
            jQuery('.busca-servico.-end').html(cloneAlerta);

            // Remove filtro
            jQuery('.busca-servico.-end .busca-servico .caixa').remove();
        });
    }
}
(function(){
    if ( jQuery( '.site-filho' ).length) {
        jQuery('a[href="#"]').attr('href','javascript:;');
    }
})();

//clonesServicos();

// Antigamente o h2 mudava de lado na agenda
// Hoje em dia não é mais necessário, deixei comentado, em memória

var cloneData = jQuery('.agenda-horarios .agenda-dia h2').clone();
function cloneAgenda(){
    //Refine sua busca mobile:
     //virifica o tamanho da tela

     if(jQuery(window).outerWidth(true) <= 1024){
        if ( !jQuery('.agenda-horarios .agenda-dia h2').length ) {
            jQuery('.agenda-horarios .agenda-dia').prepend(cloneData);

            jQuery('.calendario h2').remove();
        }
    }
    //virifica o tamanho da tela
    if(jQuery(window).outerWidth(true) <= 768){

        jQuery('.-js-h2cloned').each(function(){
            jQuery(this).prepend(cloneData);

            jQuery('.agenda-horarios .agenda-dia h2').remove();
        });
    }
}

cloneAgenda();

jQuery( window ).resize(function(){
    cloneAgenda();
})

/**
 * Ajusta o link do menu quando ativo
 */
jQuery(document).ready(function($){

    var current_url = window.location.href.replace(/(^\w+:|^)\/\//, '');
        current_url = current_url.substring(0, current_url.length - 1)
    var home_url = window.location.host;
    var itemhome = $("#menu-principal li:first-child");
    var itemswithclass = $("#menu-principal li.current-menu-item");

    //console.log(current_url);
    //console.log(home_url);

    if( current_url === home_url ){
        itemswithclass.removeClass('current-menu-item');
        itemhome.addClass('current-menu-item');
    }

});

/**
 * Acessibilidade
 */
jQuery(document).ready(function($){

    // aumentar e diminuir a fonte de conteudo
    var minTamanhoFont = 8;
    var maxTamanhoFont = 20;

    $(".menu-accessibility__link--increase").on("click", function(e){
        
        e.preventDefault();

        var ellements = $("#main, #main p, #main span, #main em, #main li, #main h1, #main h2, #main h3, #main h4, #main h5, #main h6, #main table, #main table a,#main table div");

        ellements.each( function(){
            var fontSize = $(this).css("font-size");
                fontSize = parseInt(fontSize) + 1;

            if( fontSize < maxTamanhoFont){
                $(this).css("font-size", fontSize );
            }
            
        } );

    });

    $(".menu-accessibility__link--decrease").on("click", function(e){

        e.preventDefault();

        var ellements = $("#main, #main p, #main span, #main em, #main li, #main h1, #main h2, #main h3, #main h4, #main h5, #main h6, #main table, #main table a,#main table div");

        ellements.each( function(){
            var fontSize = $(this).css("font-size");
                fontSize = parseInt(fontSize) -1;
        
            if( fontSize > minTamanhoFont){
                $(this).css("font-size", fontSize );
            }
            
        } );
    });

    var ellements = $("#main, #main p, #main span, #main em, #main li, #main h1, #main h2, #main h3, #main h4, #main h5, #main h6, #main table, #main table a,#main table div");
    var values_defaults = [];

    ellements.each(function(){
        var font_size = $(this).css("font-size");
        var index_val = $(this).context.localName;
        values_defaults.push({  "tagname" : index_val, "fontsize": font_size })
    });

    $(".menu-accessibility__link--normal").on("click", function(e){
        
        e.preventDefault();       

        var ellements = $("#main, #main p, #main span, #main em, #main li, #main h1, #main h2, #main h3, #main h4, #main h5, #main h6, #main table, #main table a,#main table div");
        
        ellements.each( function(el){            
            var $this = $(this);
            if( $this.context.localName == values_defaults[el].tagname ){
                $this.css( "font-size" , values_defaults[el].fontsize);
            }
        } );

    });

    $(".menu-accessibility__link--contraste").on("click", function(e){

        e.preventDefault();

        $("body").toggleClass("body-contraste");

       if( $("body").hasClass("body-contraste") ){
            $(".footer__logo").attr("src","http://www.ceara.gov.br/wp-content/uploads/2018/07/logo-ceara-branca.png");
       }else{
            $(".footer__logo").attr("src","http://ww2.ceara.gov.br/wp-content/uploads/2017/08/logo-ceara.png");
       }

    });
});

/**
 * Pesquisa de ramais do módulo de ramais
 */
jQuery(document).ready(function($){

    // deixa o select com uma cara mais amigavel
    $("#setor").select2({
        placeholder: "Selecione o setor",
        allowClear: true,
        language: "pt-BR"
    });

    $(".loading").hide();

    var base_url = window.location.protocol+"//"+window.location.hostname,
        base_api_url = "/wp-json/wp/v2/ramais",
        ramais_api_url = base_url+base_api_url;

    // quando clicar em ver mais ramais
   /* $('.btn-load-ramais').on('click', function(e){
        e.preventDefault();
        
        $(".loading").show();
        var setor_slug = $(this).data('setorslug');
        var setor_nome = $(this).data('setorname');
        var coordenador = $(this).data('coordenador');
        var ramal_principal = $(this).data('ramalprincipal');

        getRamais(ramais_api_url, setor_slug); 
        
        setTimeout(function(){
            $('#setor-name').text(setor_nome);
            $('#setor-coordenador').text(coordenador);
            $('#setor-ramal').text(ramal_principal);

            $(".SistemasExternos--listaramais").append("<a href='#' title='voltar'>voltar</a>");
        }, 500);

    });*/

    // quando o formulário é submetido 
    $('#form-pesquisa-ramal').on('submit', function(e){
        
        e.preventDefault();

        var setor_value = $("#form-pesquisa-ramal #setor").val();
        var setor_funci = $("#form-pesquisa-ramal #funcionario").val();
        
        $(".loading").show();

        getRamais(ramais_api_url, setor_value, setor_funci);        
        
    });

    function getRamais( url, setor = "", funcionario = "" ){
        $.ajax({
            method: "GET",
            url: url,
            dataType: "json",
            data: { setor: setor, funcionario: funcionario },
            complete: function(response){
                $(".loading").hide();

                $(".info-ramais-setor").remove();
                
                var response_ramais = response.responseJSON;
                var status = response.status;
                
                switch (status){
                    case 404:
                        $(".SistemasExternos--listaramais  > table").remove();
                        $(".SistemasExternos--listaramais  .sem-ramal").remove();
                        $(".SistemasExternos--listaramais").append('<p class="sem-ramal">'+ response_ramais.message +'</p>');
                    break;

                    case 200:
                        var ramais = "";

                        if( response_ramais.length ){
                            $(".SistemasExternos--listaramais  > table").remove();
                            $(".SistemasExternos--listaramais  .sem-ramal").remove();
                            
                            /*ramais += "<article class='info-ramais-setor'>";
                            ramais += "<div><strong>Setor: </strong> <span id='setor-name'></span> </div>";
                            ramais += "<div><strong>Coordenador: </strong> <span id='setor-coordenador'></span> </div>";
                            ramais += "<div><strong>Ramal Principal: </strong> <span id='setor-ramal'></span> </div>";
                            ramais += "</article>";*/
                            ramais += "<table width='100%'>";
                            ramais += "<thead>";
                            ramais += "<tr>";
                            ramais += "<th width='33.333%'>Funcionários</th>";
                            ramais += "<th width='33.333%'>Ramais</th>";
                            ramais += "<th width='33.333%'>Setor</th>";
                            ramais += "</tr>";
                            ramais += "</thead>";
                            ramais += "<tbody>";
                            response_ramais.forEach( function(ramal, index){
                                ramais += "<tr>";
                                ramais += "<td class='laranja'>";
                                ramais += ramal.meta_value? ramal.meta_value : '';
                                ramais += "</td>";
                                ramais += "<td><div>";
                                ramais += ramal.telefone['0']? '<a href="tel:'+ramal.telefone['0']+'">' :'';
                                ramais += ramal.telefone['0']?ramal.telefone['0'] :'';
                                ramais += ramal.telefone['0']? '</a>' :'';
                                ramais += "</div></td>";
                                ramais += "<td><div>";
                                ramais += "<a href='"+base_url+"/ramal/"+ramal.post_name+"'>"+ramal.post_title+"</a>";
                                ramais += "</div></td>";
                                ramais += "</tr>";
                            });
                            ramais += "</tbody>";
                            ramais += "</table>";

                            $(".SistemasExternos--listaramais").append(ramais);
                        
                        }
                        
                    break;
                }                
            }
        });
    }

});

/**
 * Cria interesão com as pastas no modulo de downloads
 */
jQuery(document).ready(function($){
  $(".arquivos-sublist__link").click(function(){
    var idEleLink = $(this).attr('id').split('folder-').pop();
    $(this).next("section").slideToggle("fast");
    var folder_img = $(this).children("img:first-child");
    var folder_img_src = folder_img.attr("src");
    folder_img.attr("src", folder_img.attr("src").indexOf('opened') != -1 ? "/wp-content/themes/ceara2017/assets/images/icon-folder-closed.svg" : "/wp-content/themes/ceara2017/assets/images/icon-folder-opened.svg");
  });
});

/**
 * Questionario tabs
 */
jQuery(document).ready(function($){
    $('.tabheadequestion__tab').on('click', function(e){
        var tabId = $(this).data('tab');
        $('.tabcontentquestion').hide();
        $('.tabcontentquestion#'+tabId).show();
        e.preventDefault();
    });
});