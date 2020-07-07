import * as shell from "shelljs";
import fs from "fs";
<<<<<<< HEAD
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
=======

shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
>>>>>>> 1c0105c872efe0db8abf20a31233e0049185e73d

if (shell.ls('localhost.crt').length == 0) {
  shell.exec('openssl req \
    -new \
    -newkey rsa:4096 \
    -days 365 \
    -nodes \
    -x509 \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost" \
    -keyout localhost.key \
    -out localhost.crt');
}