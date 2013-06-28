function loadRepos(data) {
				data.sort(function(item1, item2) {
					return item1.name.localeCompare(item2.name);
				})
				var items = []
				
				$.each(data, function(index, repo) {
					if (repo.name != 'baloise.github.io') {
						items.push("<li class='repo'><a href='" + repo.html_url + "'><div class='repo-name'><h3 class='no-toc'>"
								+ repo.name + "</h3><div class='repo-desc'>" + repo.description + "</div></div>"
								+ '</a></li>')
					}
				});
				
				$('<ul/>', {
					'class' : 'repos',
					html : items.join('')
				}).appendTo('#repos')
}

function loadMembers(data) {
		 data.sort(function(item1, item2) {
			return item1.login.localeCompare(item2.login);
		})

		var items = []
		$.each(data, function(index, member) {
			var avatar = member.avatar_url.split("?")[0]
					+ '?d=http://baloise.github.io/nobody.jpg'
			items.push("<li class='contributor'><a href='" + member.html_url
					+ "'><img src='" + avatar
					+ "'/><span class='contributor-name'>" + member.login
					+ "</span></a></li>")
		})
		$('<ul/>', {
			'class' : 'repos',
			html : items.join('')
		}).appendTo('#members')
}

function initNavigation() {
	$('#menu_0').show();
	$(".navSelector").bind('click', function(e) {
		$('.navSelector').children().removeClass('MenuSelected');
		$(this).children().addClass('MenuSelected');
		$('.menuContent').hide();
		
		$('#menu_' + $(this).attr('value')).show();
	});
	

			loadRepos(repos);
		
	
	
	
		
			loadMembers(members);

}
