/* global describe, it */
import Renderer, { createElement, generateHTML, safe } from "..";
import BufferedStream from "../src/buffered-stream";
import assert from "assert";

describe("basic API features", _ => {
	it("should export specified API", () => {
		let renderer = new Renderer();
		assert(renderer.registerView.name, "registerView");
		assert(renderer.renderView.name, "renderView");

		assert.equal(createElement.name, "createElement");
		assert.equal(generateHTML.name, "generateHTML");
		assert.equal(safe.name, "safe");
	});

	it("should generate HTML", done => {
		let el = generateHTML("html", { lang: "en" },
				generateHTML("body", { id: "top" },
						generateHTML("h1", null, "hello world"),
						generateHTML("p", null, "lorem ipsum"),
						callback => { // deferred child element
							let el = generateHTML("footer", null, "…");
							setTimeout(_ => {
								callback(el);
							}, 100);
						}));

		let stream = new BufferedStream();
		el(stream, { nonBlocking: true }, function() {
			assert.equal(arguments.length, 0);
			assert.equal(stream.read(), '<html lang="en"><body id="top">' +
					"<h1>hello world</h1><p>lorem ipsum</p><footer>…</footer>" +
					"</body></html>");
			done();
		});
	});
});
