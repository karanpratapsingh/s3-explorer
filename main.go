package main

import (
	"app/api"
	"embed"
	"io/fs"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const path = "web/build"

//go:embed web/build
//go:embed web/build/_next
//go:embed web/build/_next/static/chunks/pages/*.js
//go:embed web/build/_next/static/*/*.js
var nextFS embed.FS

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

func main() {
	build, err := fs.Sub(nextFS, path)

	if err != nil {
		panic(err)
	}

	router := mux.NewRouter()

	a := api.New(router, build)
	a.Start(8080)
}
