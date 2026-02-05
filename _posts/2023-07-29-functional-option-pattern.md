---
title: "Go: The Functional Option Pattern"
excerpt: "A design pattern in Go to pass in functions that alter the state of a type."
last_modified_at: 2023-07-29T19:33:39-03:00
tags: 
  - go
---

The Functional Options pattern is a design pattern in Go where you pass in functions that alter the state of a type. These functions are often called "option functions". They provide a way to cleanly design APIs and offer a more flexible and readable way to interact with a function or type.

In the example bellow, we create a new server with host "localhost" and port "8080" by calling NewServer with `WithHost` and `WithPort` functions, which are examples of functional options.

This pattern allows for more readable and flexible configuration of objects. With this pattern, it's easy to provide default values, and the API remains clean and easy to use even as more configuration options are added. Also, it's clear which options have been set, and which have not.

```go
type Server struct {
    host string
    port int
}

type ServerOptions func(*Server)

func WithHost(host string) ServerOptions {
    return func(s *Server) {
        s.host = host
    }
}

func WithPort(port int) ServerOptions {
    return func(s *Server) {
        s.port = port
    }
}

func NewServer(opts ...ServerOptions) *Server {
    s := &Server{}
    for _, opt := range opts {
        opt(s)
    }
    return s
}

func main() {
    s := NewServer(WithHost("localhost"), WithPort(8080))
}
```

This pattern is notably utilized in Go's gRPC package, among others. The gRPC package provides numerous predefined functions for common options.
