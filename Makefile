run:
	npx concurrently "make run-web" "make run-server" 

run-web:
	cd web && npm run dev

run-server:
	cd web && npm run export
	go install github.com/cespare/reflex@latest
	go run main.go

build:
	cd web && npm run export
	go build -o app
