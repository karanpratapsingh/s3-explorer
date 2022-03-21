package service

import (
	"context"
	"time"
)

type Service interface {
	Buckets(ctx context.Context) BucketsResponse
	Navigate(ctx context.Context, request NavigateRequest) NavigateResponse
}

type Bucket struct {
	Name         string    `json:"Name"`
	CreationDate time.Time `json:"creationDate"`
}

type BucketsResponse struct {
	Buckets []Bucket `json:"buckets"`
	Total   int      `json:"total"`
}

type NavigateRequest struct{}

type NavigateResponse struct{}
