package api

import (
	"fmt"
	"io/fs"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type Api struct {
	router *mux.Router
	assets fs.FS
}

func New(router *mux.Router, assets fs.FS) Api {
	return Api{router, assets}
}

func (api Api) Start(port int) {
	api.router.Handle("/", http.FileServer(http.FS(api.assets))).Methods(http.MethodGet)

	log.Info().Int("port", port).Msg("Starting...")
	addr := fmt.Sprintf(":%d", port)
	panic(http.ListenAndServe(addr, api.router))
}
