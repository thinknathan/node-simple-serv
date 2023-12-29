# Simple Server

Run the server with default settings (port 8080, index file extension set to 'html'):

`serve`

## Port:

You can specify a custom port using the -p or --port option:

`serve -p 3000`

## Index File Extension:

You can specify a custom extension for the index file using the -i or --index-extension option:

`serve -i htm`

## Shared Array Buffer Support:

Activate `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin`

`serve -s true`
