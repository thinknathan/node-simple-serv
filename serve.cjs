#!/usr/bin/env node
'use strict';
const http = require('http');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const yargs = require('yargs');

function main() {
	const root = process.cwd();

	const argv = yargs
		.option('port', {
			alias: 'p',
			description: 'Port number for the server',
			default: 8080,
		})
		.option('index-extension', {
			alias: 'i',
			description: 'Extension for the index file',
			default: 'html',
		})
		.option('shared-array-buffer', {
			alias: 's',
			description: 'Enable security headers for SharedArrayBuffer',
			default: false,
			type: 'boolean',
		}).argv;

	const port = argv.port;
	const indexExtension = argv['index-extension'];
	const enableSharedArrayBuffer = argv['shared-array-buffer'];

	const server = http.createServer((req, res) => {
		const filePath = path.join(root, req.url);

		if (!fs.existsSync(filePath)) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('Not Found');
			return;
		}

		const isDirectory = fs.statSync(filePath).isDirectory();

		if (isDirectory) {
			const indexFileName = `index.${indexExtension}`;
			const indexFilePath = path.join(filePath, indexFileName);

			if (fs.existsSync(indexFilePath)) {
				// Serve the specified index file if it exists in the directory
				const fileStream = fs.createReadStream(indexFilePath);
				res.writeHead(200, { 'Content-Type': 'text/html' });
				fileStream.pipe(res);
			} else {
				// Serve directory listing as HTML
				const directoryListing = fs
					.readdirSync(filePath)
					.map((item) => `<li>${item}</li>`)
					.join('');
				const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Directory Listing</title>
            ${
							enableSharedArrayBuffer
								? '<meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp">'
								: ''
						}
            ${
							enableSharedArrayBuffer
								? '<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin">'
								: ''
						}
          </head>
          <body>
            <h1>Directory Listing</h1>
            <ul>${directoryListing}</ul>
          </body>
        </html>
      `;
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(html);
			}
		} else {
			if (path.extname(filePath) === '.wasm') {
				const wasmMimeType = mime.contentType('wasm');
				res.writeHead(200, {
					'Content-Type': wasmMimeType,
					...(enableSharedArrayBuffer && {
						'Cross-Origin-Embedder-Policy': 'require-corp',
						'Cross-Origin-Opener-Policy': 'same-origin',
					}),
				});
			} else {
				// Serve other files
				res.writeHead(200, {
					...(enableSharedArrayBuffer && {
						'Cross-Origin-Embedder-Policy': 'require-corp',
						'Cross-Origin-Opener-Policy': 'same-origin',
					}),
				});
			}
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);
		}
	});

	server.listen(port, () => {
		console.log(`Server running at http://localhost:${port}/`);
	});
}

main();
