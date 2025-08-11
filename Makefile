
publish:
	npm run build
	npm version patch
	npm run update-version
	npm run build
	git commit -am "Bump version"
	git push origin master
	npm publish --access public
