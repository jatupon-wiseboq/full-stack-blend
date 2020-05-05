import * as shell from "shelljs";
import fs from "fs";
import archiver from "archiver";

shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/public/js/lib", "dist/public/js/lib");

const archive = archiver("zip", { zlib: { level: 9 }});
const stream = fs.createWriteStream("dist/public/boilerplate.zip");

archive
	.directory("src/public/js/construction/distribution/boilerplate", false)
  .pipe(stream);
archive.finalize();