	$('.navbar-brand').click(function(evt) {
		$('html, body').animate({scrollTop: '0'}, 1200, 'easeInOutCubic');
		pde(evt);
	});
