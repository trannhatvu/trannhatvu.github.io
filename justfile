node22 := "npm exec --yes --package=node@22.23.4 --package=npm@10 --call"

default:
    @just --list

install:
    {{node22}} 'npm ci'

dev:
    {{node22}} 'npm run dev'

check:
    {{node22}} 'npm run check'

pages-config:
    {{node22}} 'npm run pages:config'

build:
    {{node22}} 'npm run build'

test: build
    {{node22}} 'npm test'

browser-install:
    {{node22}} 'npx playwright install chromium'

test-browser: build
    {{node22}} 'npm run test:browser'

verify:
    {{node22}} 'npm run check'
    {{node22}} 'npm run build'
    {{node22}} 'npm test'

verify-browser:
    {{node22}} 'npm run check'
    {{node22}} 'npm run build'
    {{node22}} 'npm test'
    {{node22}} 'npm run test:browser'

preview: build
    {{node22}} 'npm run preview'
