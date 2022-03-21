package api

import "net/http"

func (api apiImpl) ListBuckets(w http.ResponseWriter, r *http.Request) {
	data := api.svc.Buckets(r.Context())
	api.response(w, data)
}
