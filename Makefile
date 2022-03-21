run:
	cd web && npm run build
	npx concurrently "make run-web" "make run-server"

run-web:
	cd web && npm run dev

run-server:
	go run main.go

build:
	cd web && npm run build
	go build -o app
