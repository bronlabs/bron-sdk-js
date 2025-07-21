
publish:
	npm run build
	npm version patch
	npm publish --access public
