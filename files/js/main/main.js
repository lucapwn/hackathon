jQuery(document).ready(function($) {
    jQuery("header.cc-header .cc-main-menu > ul > li.menu-item-has-children > a").click(function(event) {
        return false;          
        event.preventDefault();
        // var href = jQuery(this).attr("href");

        // if(href.trim() == "#") {
        // }
    });
});