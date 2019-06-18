PROJ_ROOT := $(shell pwd)
BUILD_DIR := build
PROJECT_NAME := trivagoext
VERSION := $(shell cat version)
TEMP_DIR := build/temp
TEMP_SRC := ${PROJECT_NAME}-${VERSION}
EXT_DIR := chrome-extension
THEME_DIR := themes
KEY_NAME := key.pem
KEY_PATH := ${BUILD_DIR}/${KEY_NAME}
KEY_EXISTS := $(shell if [ -f ${KEY_PATH} ]; then echo 1; else echo 0; fi)

help: ## Show this help message
	@echo 'usage: make [target] ...'
	@echo
	@echo 'targets:'
	@sed -n 's/^\([a-z \-]*\):.*\(##.*\)/\1 \2/p' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'
.PHONY: help

## make targets start here ##
.PHONY: release-build
release-build: git-tag build ## builds a new instances and creates a tag for a release

.PHONY: build
build: clean-temp create-temp copy-temp update-version copy-key zip ## builds a new instance of the extension

.PHONY: git-tag
git-tag: ## tags the current state in git and pushes it
	@git tag ${VERSION} -m 'auto tagging version ${VERSION}' && git push origin ${VERSION}

.PHONY: zip
zip: ## creates the zip package
	@cd ${TEMP_DIR}/${TEMP_SRC}; zip -r ../../${PROJECT_NAME}-${VERSION}.zip *

.PHONY: copy-temp
copy-temp: ## copies current dev data to temp build dir
	@cp -r ${EXT_DIR}/* ${TEMP_DIR}/${TEMP_SRC}

.PHONY: create-temp
create-temp: ## create temp src build dir
	@mkdir -p ${TEMP_DIR}/${TEMP_SRC}

.PHONY: clean-temp
clean-temp: ## create temp src build dir
	@rm -rf ${TEMP_DIR}/${TEMP_SRC}

.PHONY: copy-key
copy-key: ## copies publishing key to build target if existing
ifeq (1,${KEY_EXISTS})
	@cp ${KEY_PATH} ${TEMP_DIR}/${TEMP_SRC}/${KEY_NAME}
endif

.PHONY: bump-version
bump-version: ## bumps version by user input
	@read -p "enter new version (current: ${VERSION}): " newversion; echo $$newversion > version;
	@echo Please remember to update the Changelog.md file with a description of your current changes.

.PHONY: update-version
update-version: ## updates version number in manifest
	@sed -i 's/"version": ".*",/"version": "${VERSION}",/g' ${TEMP_DIR}/${TEMP_SRC}/manifest.json

.PHONY: check-vars
check-vars: ## checks vars
	@echo ${BUILD_DIR}
	@echo ${PROJECT_NAME}
	@echo ${VERSION}
	@echo ${TEMP_DIR}
	@echo ${TEMP_SRC}
	@echo ${EXT_DIR}
	@echo ${KEY_PATH}
	@echo ${KEY_EXISTS}
