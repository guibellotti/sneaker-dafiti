"use strict";

// Plugins
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer"); // Prefixer CSS
const cleanCSS = require("gulp-clean-css"); // CSS minificado
const del = require("del"); // Deletar arquivos
const copy = require("gulp-copy"); // Copiar arquivos
const terser = require("gulp-terser"); // JS minificando e verificando arquivo
const pump = require("pump"); // JS dependencia
const versionNumber = require("gulp-version-number"); // Versionamento arquivos
const imagemin = require("gulp-imagemin"); // Minificar imagem
const htmlmin = require("gulp-htmlmin"); // Minificar HTML
const zip = require("gulp-zip"); // Zipando arquivos
const prompt = require("gulp-prompt"); // Interagindo com o terminal
require('dotenv').config();

var msgProject = "Insira o nome do projeto:";
var msgZipRao = "Pacote gerado com sucesso!\n";
const versionConfig = {
  value: "%MDS%",
  append: {
    key: "ggb",
    to: ["css", "js", "image"]
  }
};

var paths = {
  html: "./*.html",
  images: "./include/images/**/*.{JPG,jpg,ico}",
  css: "./include/css/main.css",
  js: "./include/js/*.js",
};

var compressFiles = ["./dist/**/*"];

var pathsExp = {
  dist: "./dist",
  html: "./dist/",
  images: "./dist/include/images/",
  css: "./dist/include/css/",
  js: "./dist/include/js/",
};

// Limpando diretório
gulp.task("clean", () => {
  return del(pathsExp.dist);
});

// Autoprefixer CSS, minificando e copiando
gulp.task("css", () => {
  var plugins = [autoprefixer()];
  return gulp
    .src(paths.css)
    .pipe(copy(pathsExp.css, { prefix: 2 }))
    .pipe(
      gulp
        .src(paths.css)
        .pipe(cleanCSS())
        .pipe(
          autoprefixer({
            cascade: false
          })
        )
    )
    .pipe(gulp.dest(pathsExp.css));
});

// Minificando JS e copiando
gulp.task("js", () => {
  return gulp
    .src(paths.js)
    .pipe(terser())
    .pipe(gulp.dest(pathsExp.js));
});

// Minificando imagens
gulp.task("images", () => {
  return gulp
    .src(paths.images)
    .pipe(
      imagemin([
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest(pathsExp.images));
});

// Minificando HTML
gulp.task("html", () => {
  return gulp
    .src(paths.html)
    .pipe(versionNumber(versionConfig))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(pathsExp.html));
});

// Zipando a pasta (criar pacote)
gulp.task("pack", () => {
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  var client = "";
  var date = new Date();
  var versionPack =
    date.getFullYear() +
    "" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "" +
    ("0" + date.getDate()).slice(-2);
  var raoName = "";
  var res = "";
  var randomKey = makeid(6);

  return gulp.src(compressFiles).pipe(
    prompt.prompt(
      {
        type: "input",
        name: "nameProject",
        message: msgProject
      },
      function compressPack(res) {
        client = res.nameProject;
        raoName =
          "Prj" +
          "_" +
          client.toUpperCase() +
          "_" +
          versionPack +
          "_version-" +
          randomKey +
          ".zip";
        console.log(msgZipRao + raoName);
        gulp
          .src(compressFiles)
          .pipe(zip(raoName))
          .pipe(gulp.dest(pathsExp.dist));
      }
    )
  );
});

// Gerando o pacote
gulp.task(
  "build",
  gulp.series(
    "clean",
    "css",
    "js",
    "images",
    "html",
    "pack"
  )
);