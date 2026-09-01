const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {URL} = require("url");

const repositoryRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(repositoryRoot, "src");
const worksPath = path.join(sourceRoot, "works.json");
const worksData = JSON.parse(fs.readFileSync(worksPath, "utf8"));
const allowedPreviewTypes = new Set(["video", "youtube", "img"]);
const titles = new Set();

function assertText(value, description) {
    assert.strictEqual(typeof value, "string", `${description} must be a string`);
    assert.ok(value.trim(), `${description} must not be empty`);
}

function assertHttpUrl(value, description) {
    assertText(value, description);
    const url = new URL(value);
    assert.ok(["http:", "https:"].includes(url.protocol), `${description} must use HTTP(S)`);
}

assert.ok(worksData && Array.isArray(worksData.works), "works.json must contain a works array");
assert.ok(worksData.works.length > 0, "works.json must contain at least one work");

worksData.works.forEach((work, index) => {
    const label = `works[${index}]`;

    assert.ok(work && typeof work === "object", `${label} must be an object`);
    assertText(work.title, `${label}.title`);
    assert.ok(!titles.has(work.title), `duplicate work title: ${work.title}`);
    titles.add(work.title);

    assert.ok(allowedPreviewTypes.has(work.previewType), `${label}.previewType is unsupported`);
    assertText(work.previewSrc, `${label}.previewSrc`);
    assertText(work.descriptionText, `${label}.descriptionText`);

    if (/^https?:\/\//.test(work.previewSrc)) {
        assertHttpUrl(work.previewSrc, `${label}.previewSrc`);
    } else {
        assert.ok(!path.isAbsolute(work.previewSrc), `${label}.previewSrc must be relative`);
        const previewPath = path.resolve(sourceRoot, work.previewSrc);
        assert.ok(
            previewPath.startsWith(`${sourceRoot}${path.sep}`),
            `${label}.previewSrc must stay inside src`
        );
        assert.ok(fs.existsSync(previewPath), `${label}.previewSrc does not exist`);
        assert.ok(fs.statSync(previewPath).isFile(), `${label}.previewSrc must be a file`);
    }

    assert.ok(Array.isArray(work.keywords) && work.keywords.length > 0, `${label}.keywords must be non-empty`);
    work.keywords.forEach((keyword, keywordIndex) => {
        assert.ok(keyword && typeof keyword === "object", `${label}.keywords[${keywordIndex}] must be an object`);
        assertText(keyword.type, `${label}.keywords[${keywordIndex}].type`);
        assertText(keyword.keyword, `${label}.keywords[${keywordIndex}].keyword`);
    });

    assert.ok(work.links && typeof work.links === "object", `${label}.links must be an object`);
    ["direct", "github"].forEach((linkType) => {
        if (work.links[linkType] === undefined) {
            return;
        }
        assert.ok(Array.isArray(work.links[linkType]), `${label}.links.${linkType} must be an array`);
        work.links[linkType].forEach((url, linkIndex) => {
            assertHttpUrl(url, `${label}.links.${linkType}[${linkIndex}]`);
        });
    });
});

console.log(`Validated ${worksData.works.length} portfolio entries and their preview assets.`);
