package api

import (
	"app/service"
	"encoding/json"
	"net/http"
)

func (api apiImpl) ListBuckets(w http.ResponseWriter, r *http.Request) {
	data := api.svc.Buckets(r.Context())
	api.response(w, data)
}

func (api apiImpl) NavigateBucket(w http.ResponseWriter, r *http.Request) {
	var body service.NavigateRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	data := api.svc.Navigate(r.Context(), body)
	api.response(w, data)
}
