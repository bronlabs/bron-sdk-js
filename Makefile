
publish:
	npm run build
	npm version patch
	npm run update-version
	npm run build
	npm publish --access public
