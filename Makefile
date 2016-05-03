build: build_assets build_flats build_web

clean:
	rm -rf ./flats/css
	rm -rf ./flats/fonts
	rm -rf ./flats/img
	rm -rf ./flats/js
	rm -rf ./release/*
	rm -rf ./web/website/static/css
	rm -rf ./web/website/static/fonts
	rm -rf ./web/website/static/img
	rm -rf ./web/website/static/js

install: install_npm_dependencies install_composer_dependencies

build_assets: install_npm_dependencies
	node_modules/gulp/bin/gulp.js build

build_flats:
	echo "Building flats artifact..."
	tar czf ./release/pimcore-flats.tar.gz -C ./ ./flats
	echo "Built flats artifact"

build_web: install_composer_dependencies
	echo "Building web artifact..."
	tar czf ./release/pimcore-web.tar.gz -C ./ \
	    ./var/config/startup.php \
	    ./migrations.yml \
	    ./migrations-db.php \
	    ./migrations \
	    ./vendor \
	    ./web
	echo "Built web artifact"

install_composer_dependencies:
	composer install

install_npm_dependencies:
	npm install

.PHONY: build clean install build_assets build_flats build_web install_composer_dependencies install_npm_dependencies
.SILENT:
