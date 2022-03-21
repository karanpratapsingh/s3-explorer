package api

import (
	"app/service"
	"encoding/json"
	"net/http"
)

func (api apiImpl) ListBuckets(w http.ResponseWriter, r *http.Request) {
	data, err := api.svc.Buckets(r.Context())

	if err != nil {
		api.error(w, err, http.StatusInternalServerError)
		return
	}

	api.response(w, data)
}

func (api apiImpl) NavigateBucket(w http.ResponseWriter, r *http.Request) {
	var body service.NavigateRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.error(w, err, http.StatusBadRequest)
		return
	}

	data, err := api.svc.Navigate(r.Context(), body)

	if err != nil {
		api.error(w, err, http.StatusInternalServerError)
		return
	}

	api.response(w, data)
}

func (api apiImpl) PresignObject(w http.ResponseWriter, r *http.Request) {
	var body service.PresignRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	data, err := api.svc.Presign(r.Context(), body)

	if err != nil {
		api.error(w, err, http.StatusInternalServerError)
		return
	}

	api.response(w, data)
}
