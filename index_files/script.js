function loadRepos() {
	$.getJSON('https://api.github.com/orgs/baloise/repos?type=all',
			function(data) {
				data.sort(function(item1, item2) {
					return item1.name.localeCompare(item2.name);
				})
				var items = []
				$.each(data, function(index, repo) {
					if (repo.name != 'baloise.github.io') {
						items.push("<tr><td class='repo_name'><a href='" + repo.html_url + "'>"
								+ repo.name + "</td><td>" + repo.description
								+ '</tr>')
					}
				})
				$('<table/>', {
					'class' : 'repos',
					html : items.join('')
				}).appendTo('#repos')

			})
}

function loadMembers() {
	$.getJSON('https://api.github.com/orgs/baloise/public_members', function(
			data) {
		data.sort(function(item1, item2) {
			return item1.login.localeCompare(item2.login);
		})

		var items = []
		$.each(data, function(index, member) {
			console.log(member)
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

	})
}
