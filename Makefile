# Set a region if not provided
region := $(if $(region),$(region),us-east-1)

run:
	cd web && npm run build
	npx concurrently "make run-web" "make run-server"

run-web:
	cd web && npm run dev

run-server:
	ENVIRONMENT=development go run main.go --region $(region)

build: clean
	cd web && npm run build
	go build -o build/s3browser

clean:
	rm -rf web/.next web/build build
