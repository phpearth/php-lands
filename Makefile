.DEFAULT_GOAL := help
.PHONY: *

help:
	@echo "\033[33mUsage:\033[0m\n  make [target] [arg=\"val\"...]\n\n\033[33mTargets:\033[0m"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[32m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Get up and running with Jekyll and Docker on localhost
	docker run -it --rm --label=jekyll -v=`pwd`:/srv/jekyll -p 127.0.0.1:4000:4000 jekyll/jekyll:pages jekyll s

slice: ## Slice given image to DZI format
	bin/magic-slicer.sh map.jpg

yarn: ## Run Yarn command in a Node.js Docker container
	@test "$(a)"
	docker run -it --rm -v `pwd`:/home/node/app -w /home/node/app node:alpine yarn $(a)
