$(document).ready(function() {
    'use strict';
  
    var html = $('html'),
    toggleTheme = $(".toggle-theme");
  
    detectAndSetDarkMode()

    toggleTheme.click(function () {
      darkMode()
    });

    function darkMode() {
        if (html.hasClass('dark-mode')) {
          html.removeClass('dark-mode');
          localStorage.setItem("theme", "light");
          document.documentElement.removeAttribute("dark");
        } else {
          html.addClass('dark-mode');
          localStorage.setItem("theme", "dark");
          document.documentElement.setAttribute("dark", "");
        }
      }
      
      function detectAndSetDarkMode() {
        if(localStorage.getItem("theme") == "light") { return }
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
          html.addClass('dark-mode');
          localStorage.setItem("theme", "dark");
          document.documentElement.setAttribute("dark", "");
        } 
      }

  $(".top").click(function() {
    $("html, body").stop().animate({ scrollTop: 0 }, "slow", "swing");
  });
  $(window).scroll(function() {
    if ($(this).scrollTop() > $(window).height()) {
      $(".top").addClass("is-active");
    } else {
      $(".top").removeClass("is-active");
    }
  });

});
