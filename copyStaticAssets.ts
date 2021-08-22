import * as shell from "shelljs";
import fs from "fs";

shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.mkdir("dist/public/js/");
shell.mkdir("dist/public/css/");
shell.cp("-R", "src/public/js/*", "dist/public/js/");
shell.cp("-R", "node_modules/ruffle-mirror/*", "dist/public/js/");
shell.cp("-R", "src/public/css/*", "dist/public/css/");

if (shell.ls("localhost.crt").length == 0) {
  shell.exec("openssl req \
    -new \
    -newkey rsa:4096 \
    -days 365 \
    -nodes \
    -x509 \
    -subj \"/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost\" \
    -keyout localhost.key \
    -out localhost.crt");
}