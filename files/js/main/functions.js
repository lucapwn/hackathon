/**
 * Função que verifica se a url enviada ao Solr existe no localStorage e se o resultado está desatualizado.
 *
 * @param {String} param
 * @param {Integer} [minutes]
 * @return {Boolean}
 */
 function check_exists_in_localStorage( param, minutes ) {
    if ( localStorage.solr ) {
        var results = JSON.parse( localStorage.solr ),
            timeNow,
            minutes = minutes ? minutes : 30;
        if ( results && ( param in results ) ) {
            if ( typeof results[param]['time'] != undefined && results[param]['time'] ) {
                timeNow = new Date().getTime();
                return timeNow - results[param]['time'] < ( minutes * 60 ) * 1000;
            }
        }
    }
    return false;
}


/**
 * Função que busca, via Ajax, as informações no Solr.
 *
 * @param {Array|Object} [attrs] [{'field': 'value'}]
 * @param {Integer} [currentPage]
 * @param {String} [callback_name]
 */
function get_data_solr ( callback_name, currentPage, attrs, single ) {
    var args,
        _url,
        docs,
        postsPerPage = parseInt( solrInformation.postsPerPage ),
        currentPage = currentPage ? currentPage : 0,
        checkVariable = ( solrInformation.solrPath != undefined );
    checkVariable = checkVariable && ( solrInformation.parameterSearch != undefined );
    if ( checkVariable ) {
        // add classe de loading
        jQuery( 'body' ).addClass( 'searching-solr' );
        // argumentos para a busca
        var search_parm = solrInformation.parameterSearch;
        if ( single ) {
            search_parm = ' +' + search_parm.split( ' ' ).join( ' +' );
        } 
        // palavras a serem descartadas (stopwords)
        if ( 'stopwords' in solrInformation ) {
            for ( var sw = 0; sw < solrInformation.stopwords.length; sw++ ) {
                var sw_escape = solrInformation.stopwords[sw].replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
                var sw_replace = new RegExp( '\\b' + sw_escape + '\\b', 'gi' );
                search_parm = search_parm.replace( sw_replace, '' );
            }
            search_parm = search_parm.replace( /  /gi, ' ' ).trim();
        }
        if ( single ) {
            args = '?q=' + encodeURIComponent( search_parm );
        } else {
            // quebra em palavras
            var arr_termo = search_parm.split( ' ' ).filter( function ( a ) { return a; } );
            // pesquisa cada uma no conteúdo
            args = '?q=(' + encodeURIComponent( arr_termo.join( ' AND ' ) ) + ') ';
            // pesquisa cada uma no título por aproximação fonética
            args += 'OR (post_title_phon_pt:' + encodeURIComponent( arr_termo.join( ' AND post_title_phon_pt:' ) ) + ') ';
            // pesquisa cada uma no conteúdo por aproximação fonética
            args += 'OR (post_content_phon_pt:' + encodeURIComponent( arr_termo.join( ' AND post_content_phon_pt:' ) ) + ') ';
        }
        args += '&wt=json';
        args += '&rows=' + postsPerPage;
        args += '&start=' + ( postsPerPage * currentPage );
        args += '&facet=on';
        args += '&json.wrf=' + callback_name;
        // ordenar por data?
        if ( solrInformation.order == 1 ) args += '&sort=post_date_s%20desc';
        // attrs
        if ( typeof attrs != undefined && ( jQuery.isArray( attrs ) ) ) {
            for ( var x = 0; x < attrs.length; x ++ ) {
                var keys = Object.keys( attrs[x] );
                for ( var y = 0; y < keys.length; y ++ ) {
                    args += '&' + keys[y] + '=' + attrs[x][keys[y]];
                }
            }
        }
        // url
        _url = solrInformation.solrPath + '/select/' + args;

        var ajax_args = {
            'url': _url,
            'dataType': 'jsonp',
            'cache': true
        };
        jQuery.ajax( ajax_args );
        var solr_timeout = 5; //segundos
        solrInformation.callbackTimeout = setTimeout( function () {
            if ( 'ajaxError' in solrInformation ) solrInformation.ajaxError.call();
        }, solr_timeout * 1000 );
    } else {
        console.log( 'Undefined variables "solrInformation.solrPath" or "solrInformation.parameterSearch"' );
    }
}


/**
 * Função que executa o Callback enviado pelo get_data_solr
 *
 * @param {Object} data
 */
function executeCallback ( data ) {
    solrInformation.callback( data );
}


/**
 * Função que retira o caracter ':'.
 *
 * @param {Array} chars
 * @return {String} newChar
 */
function replace_char_special ( chars ) {
    // escapando o ":"
    var newChar = '';
    for ( var x = 0; x < chars.length; x ++ ) {
        if ( x > 0 ) newChar += '\\\:';
        newChar += encodeURIComponent( chars[ x ] );
    }
    return newChar;
}


/**
 * Função que salva o resultado da busca, do Solr, no localStorage.
 *
 * @param {Object} data
 * @param {String} param
 * @param {Array} [fields]
 */
function set_localStorage ( data, param, fields ) {
    if ( typeof data != undefined && ( typeof param != undefined ) && ( data ) && ( param ) ) {
        if ( ! localStorage.solr ) localStorage.solr = '';
        var array_aux = localStorage.solr ? JSON.parse( localStorage.solr ) : {};
        if ( typeof fields != undefined && jQuery.isArray( fields ) ) {
            var aux_data = [],
                docs = data.response.docs;  
            for ( var x = 0; x < docs.length; x ++ ) {
                var item = {};
                for ( key in docs[x] ) {
                    if ( jQuery.inArray( key, fields ) > -1 ) {
                        item[key] = docs[x][key];
                    }
                }
                aux_data.push( item );
            }
            array_aux[param] = aux_data;
        } else {
            array_aux[param] = data.reponse.docs;
        }
        array_aux[param]['time'] = new Date().getTime();
        localStorage.solr = JSON.stringify( array_aux );
    }
}


/**
 * Função que busca as informações no localStorage.
 *
 * @param {String} param
 * @return {Object}
 */
function get_data_localStorage ( param ) {
    if ( typeof param != undefined && param ) {
        if ( typeof localStorage.solr != undefined ) {
            var aux = JSON.parse( localStorage.solr );
            if ( typeof aux[param] != 'undefined' && aux[param] ) {
                return aux[param];
            }
        }
    }
    return false;
}


/**
 * Função que constrói ID para os elementos da página.
 *
 * @param {String} char
 * @return {String} char
 * @example
 * // return 'x-y-z'
 * construct_id('x y z');
 */
 function construct_id( char ){
    if ( typeof char != 'undefined' && char ) {
        //pega valor do campo e converte para letras minúsculas
        char = decodeURIComponent( char );
        char = char.toLowerCase();
        //faz as substituições dos acentos
        char = char.replace( /[á|ã|â|à]/gi, 'a' );
        char = char.replace( /[é|ê|è]/gi, 'e' );
        char = char.replace( /[í|ì|î]/gi, 'i' );
        char = char.replace( /[õ|ò|ó|ô]/gi, 'o' );
        char = char.replace( /[ú|ù|û]/gi, 'u' );
        char = char.replace( /[ç]/gi, 'c' );
        char = char.replace( /[ñ]/gi, 'n' );
        //faz a substituição dos espaços e outros caracteres por - (hífen)
        char = char.replace( /\s/gi, '-' );
        // remove - (hífen) duplicados
        char = char.replace( /(-)1+/gi, '-' );
    }
    return char;
}