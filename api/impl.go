package api

import (
	"app/service"
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type apiImpl struct {
	router *mux.Router
	assets fs.FS
	svc    service.Service
}

func New(router *mux.Router, assets fs.FS, svc service.Service) apiImpl {
	return apiImpl{router, assets, svc}
}

func (api apiImpl) routes() {
	api.router.Handle("/", http.FileServer(http.FS(api.assets))).Methods(http.MethodGet)
	api.router.HandleFunc("/api/buckets/list", api.ListBuckets).Methods(http.MethodGet)
	api.router.HandleFunc("/api/buckets/navigate", api.NavigateBucket).Methods(http.MethodPost)
	api.router.HandleFunc("/api/objects/presign", api.PresignObject).Methods(http.MethodPost)
}

func (api apiImpl) Start(port int) {
	api.routes()

	log.Info().Int("port", port).Msg("Starting...")
	addr := fmt.Sprintf(":%d", port)
	panic(http.ListenAndServe(addr, api.router))
}

func (api apiImpl) response(writer http.ResponseWriter, data interface{}) {
	writer.Header().Add("Content-Type", "application/json")
	json.NewEncoder(writer).Encode(data)
}

func (api apiImpl) error(writer http.ResponseWriter, err error, code int) {
	writer.Header().Add("Content-Type", "application/json")
	writer.WriteHeader(code)
	json.NewEncoder(writer).Encode(ApiError{err.Error()})
}
