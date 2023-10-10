const asciidoctor = require('asciidoctor')({
    runtime: {
        platform: 'browser',
        engine: 'v8',
        framework: 'webextensions'
    }
})
const path = require('path');
const config = require('config');
const fs = require('fs-extra');
const glob = require('glob');
//ファイル一覧
let fileList;

//output配下を削除
fs.rmSync(config.OUTPUT_PATH, { recursive: true, force: true });

//src配下のファイルを取得する。
glob('src/**/*', (err, files) => {
    fileList = files.filter(function (file) {
        //adocを指定して配置する。
        return fs.statSync(file).isFile() && /.*\.adoc$/.test(file);
    })
    fileList.forEach(file => {
        //html作成
        let html = asciidoctor.convertFile(file, { to_file: false, standalone: true, safe: 'safe' })
        //出力先Path
        let outputPath = file.replace('src', config.OUTPUT_PATH).replace('.adoc', '.html');
        //ディレクトリ作成
        if (!fs.existsSync(path.dirname(outputPath))) {
            fs.mkdirSync(path.dirname(outputPath));
        }
        //ファイル出力
        fs.writeFile(outputPath, html, (err, data) => {
            if (err) console.log(err);
            else console.log(`white:${file}`);
        });
    });
    //ファイルコピー
    fs.copySync(`src/${config.COPY_PATTRTN}`,`output/${config.COPY_PATTRTN}`);
    
});