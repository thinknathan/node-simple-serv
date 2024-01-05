<img src="_docs/simple-server-banner.png" alt="Simple Server">

# Simple Server

A simple localhost http server for testing, built on Node.

## Installation

1. Install [Nodejs](https://nodejs.org/en) or equivalent

2. Clone this project
   `git clone https://github.com/thinknathan/node-simple-serv`

3. Install dependencies
   `npm i`
   or
   `yarn`

4. Install for command-line usage
   `npm link`

## Usage

`serve`

```
-p, --port                     Port number for the server      [default: 8080]
-i, --index-extension          Extension for the index file  [default: "html"]
-s, --shared-array-buffer      Enable security headers for SharedArrayBuffer
																										[boolean] [default: false]
-c, --content-security-policy  Content Security Policy header value
					[default: "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'"]
```

## Background

Created with Chat-GPT 3.5.
