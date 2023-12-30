#!/usr/bin/env node
'use strict';
const http = require('http');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const yargs = require('yargs');

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
	})
	.option('content-security-policy', {
		alias: 'c',
		description: 'Content Security Policy header value',
		default: "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'",
	}).argv;

function main() {
	const root = process.cwd();
	const port = argv.port;
	const indexExtension = argv['index-extension'];

	const server = http.createServer((req, res) => {
		const filePath = path.join(root, req.url);

		if (!fs.existsSync(filePath)) {
			writeHeader(res, 404, 'text/plain');
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
				writeHeader(res, 200, 'text/html');
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
          </head>
          <body>
            <h1>Directory Listing</h1>
            <ul>${directoryListing}</ul>
          </body>
        </html>
      `;
				writeHeader(res, 200, 'text/html');
				res.end(html);
			}
		} else {
			const fileExtension = path.extname(filePath);
			const mimeType =
				mime.contentType(fileExtension) || 'application/octet-stream';
			writeHeader(res, 200, mimeType);
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(res);
		}
	});

	server.listen(port, () => {
		console.log(`Server running at http://localhost:${port}/`);
	});
}

function writeHeader(res, code, mimeType) {
	const enableSharedArrayBuffer = argv['shared-array-buffer'];
	const contentSecurityPolicy = argv['content-security-policy'];
	res.writeHead(code, {
		'Content-Type': mimeType,
		...(enableSharedArrayBuffer && {
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin',
		}),
		'Content-Security-Policy': contentSecurityPolicy,
	});
}

main();
