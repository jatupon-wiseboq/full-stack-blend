import * as shell from "shelljs";
import fs from "fs";
import archiver from "archiver";

shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/public/js/lib", "dist/public/js");

if (shell.ls('boilerplate').length == 0) {
  shell.exec("git clone https://github.com/SoftenStorm/boilerplate.git");
}

const archive = archiver("zip", { zlib: { level: 9 }});
const stream = fs.createWriteStream("dist/public/boilerplate.v1.zip");

archive
	.directory("boilerplate/src", false)
  .pipe(stream);
archive.finalize();