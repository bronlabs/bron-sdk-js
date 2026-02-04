generate:
	pnpm run generate

publish:
	pnpm run build
	pnpm version patch
	pnpm run update-version
	pnpm run build
	git commit -am "Bump version"
	git push origin master
	pnpm publish --access public
