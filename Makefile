# Set a region if not provided
region := $(if $(region),$(region),us-east-1)

prepare:
	cd web && npm install
	go mod tidy

run:
	cd web && npm run build
	npx concurrently "make run-web" "make run-server"

run-web:
	cd web && npm run dev

run-server:
	ENVIRONMENT=development go run main.go --region $(region)

build: clean
	cd web && npm run build
	go build -o build/s3explorer

.PHONY: clean
clean:
	rm -rf web/.next web/build build
