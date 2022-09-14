package service

import (
	"context"
	"time"
)

type Service interface {
	Buckets(ctx context.Context) (BucketsResponse, error)
	Navigate(ctx context.Context, request NavigateRequest) (NavigateResponse, error)
	Presign(ctx context.Context, request PresignRequest) (PresignResponse, error)
	Delete(ctx context.Context, request DeleteRequest) (DeleteResponse, error)
}

type Bucket struct {
	Name         string    `json:"name"`
	CreationDate time.Time `json:"creationDate"`
}

type BucketsResponse struct {
	Buckets []Bucket `json:"buckets"`
	Total   int      `json:"total"`
}

type NavigateRequest struct {
	Bucket string `json:"bucket"`
	Prefix string `json:"prefix"`
}

type S3ObjectType = string

var (
	S3ObjectTypeFile   S3ObjectType = "FILE"
	S3ObjectTypeFolder S3ObjectType = "FOLDER"
)

type S3Object struct {
	Name string       `json:"name"`
	Key  string       `json:"key"`
	Size *int64       `json:"size"`
	Type S3ObjectType `json:"type"`
}

type NavigateResponse struct {
	Objects []S3Object `json:"objects"`
}

type PresignRequest struct {
	Bucket   string `json:"bucket"`
	Key      string `json:"key"`
	Duration string `json:"duration"`
}

type PresignResponse struct {
	Url string `json:"url"`
}

type DeleteRequest struct {
	Bucket string `json:"bucket"`
	Key    string `json:"key"`
}

type DeleteResponse struct {
	Success bool `json:"success"`
}
