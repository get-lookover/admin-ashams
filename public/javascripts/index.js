$(document).ready(() => {

    $(".navbar-toggler").click(function (e) {
      $("#sidebar").toggleClass("ashams-show");
      $(this).find("span").toggleClass("navbar-toggler-icon");
      if (!$(this).find("span").hasClass("navbar-toggler-icon")) {
        $(this).find("span").html("&#10006;").css({'font-size': '25px', 'padding-right': '0.3em'});
      } else {
        $(this).find("span").html("");
      }
    });
  
    $(".sidebar-dropdown-toggler").click(function () {
      $(this).toggleClass('active');
      $(this).next().slideToggle();
    });

    $('.card-header').click(function () {
      $(this).toggleClass('rounded-2');
      $(this).next().slideToggle();
    });
});
      
// for removing ashams-show class 
const MediaQueriesFn = (arg) => {
  if (arg.matches) {
    $('#sidebar').removeClass('ashams-show');
  }
}
let mediaQry = window.matchMedia("(min-width: 768px)");
MediaQueriesFn(mediaQry);
mediaQry.addListener(MediaQueriesFn);

// for removing ashams-show class
const MediaQueriesFn2 = (arg) => {
  if (arg.matches) {
    $('.news-coll, .sport-coll, .wiki-coll').removeClass('show');
    $('.card-header').addClass('rounded-2');
    $('.dropdown-menu').removeClass('show');
    $(".sidebar-dropdown-toggler").removeClass('active');
  } else {
    $('.news-coll, .sport-coll, .wiki-coll').addClass('show');
    $('.card-header').removeClass('rounded-2');
    $('.dropdown-menu').addClass('show');
    $(".sidebar-dropdown-toggler").addClass('active');
  }
}
let mediaQry2 = window.matchMedia("(max-width: 767.9px)");
MediaQueriesFn2(mediaQry2);
mediaQry2.addListener(MediaQueriesFn2);


// count 

async function count(el, folder) {
  let span_data = document.querySelectorAll(el);
  let news = await fetch(`/api/get-${folder}-news`);
  let data_news = await news.json();
  let sport = await fetch(`/api/get-${folder}-sport`);
  let data_sport = await sport.json();
  let wiki = await fetch(`/api/get-${folder}-wiki`);
  let data_wiki = await wiki.json();
  span_data.forEach((e) => (e.innerHTML = data_news.length + data_sport.length + data_wiki.length));
}

count('.count-articles', 'articles');
count('.count-categories', 'catgs');