/*
	Solid State by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
	breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Header.
	if ($banner.length > 0
		&& $header.hasClass('alt')) {

		$window.on('resize', function () { $window.trigger('scroll'); });

		$banner.scrollex({
			bottom: $header.outerHeight(),
			terminate: function () { $header.removeClass('alt'); },
			enter: function () { $header.addClass('alt'); },
			leave: function () { $header.removeClass('alt'); }
		});

	}

	// Menu.
	var $menu = $('#menu');

	$menu._locked = false;

	$menu._lock = function () {

		if ($menu._locked)
			return false;

		$menu._locked = true;

		window.setTimeout(function () {
			$menu._locked = false;
		}, 350);

		return true;

	};

	$menu._show = function () {

		if ($menu._lock())
			$body.addClass('is-menu-visible');

	};

	$menu._hide = function () {

		if ($menu._lock())
			$body.removeClass('is-menu-visible');

	};

	$menu._toggle = function () {

		if ($menu._lock())
			$body.toggleClass('is-menu-visible');

	};

	$menu
		.appendTo($body)
		.on('click', function (event) {

			event.stopPropagation();

			// Hide.
			$menu._hide();

		})
		.find('.inner')
		.on('click', '.close', function (event) {

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			// Hide.
			$menu._hide();

		})
		.on('click', function (event) {
			event.stopPropagation();
		})
		.on('click', 'a', function (event) {

			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$menu._hide();

			// Redirect.
			window.setTimeout(function () {
				window.location.href = href;
			}, 350);

		});

	$body
		.on('click', 'a[href="#menu"]', function (event) {

			event.stopPropagation();
			event.preventDefault();

			// Toggle.
			$menu._toggle();

		})
		.on('keydown', function (event) {

			// Hide on escape.
			if (event.keyCode == 27)
				$menu._hide();

		});

})(jQuery);


function generateBalls() {
	for (var i = 0; i < Math.floor(window.innerWidth / 20); i++) {
		$(".gooey-animations").append(`
    <div class="ball"></div>
    `);
		var colors = ['#28323B', '#FFA036'];
		$(".ball").eq(i).css({ "bottom": "0px", "left": Math.random() * window.innerWidth - 100, "animation-delay": Math.random() * 5 + "s", "transform": "translateY(" + Math.random() * 10 + "px)", "background-color": colors[i % 2] });
	}
}
generateBalls();

window.addEventListener('resize', function (e) {
	$(".gooey-animations .ball").remove();
	generateBalls();
})




var openModalBtn = document.getElementById("openModalBtn");

// Obtiene el modal y el botón para cerrar el modal
var modal = document.getElementById("myModal");
var closeModalBtn = document.getElementById("closeModalBtn");

// Abre el modal cuando se hace clic en el botón de abrir
openModalBtn.addEventListener("click", function () {
	modal.style.display = "block";
});

// Cierra el modal cuando se hace clic en el botón de cierre
closeModalBtn.addEventListener("click", function () {
	modal.style.display = "none";
});

// Cierra el modal si se hace clic fuera de él
window.addEventListener("click", function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
});