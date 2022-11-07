const fs = require('fs');
const path = require('path');
const { promises: fsp } = fs;
const readline = require('readline');

const STYLES="styles";
const RESULT_FOLDER="project-dist";
const RESULT_FILE="bundle.css";
const CSS=".css";

const pathStyles=path.join(__dirname,STYLES);
const fileResult=path.join(__dirname,RESULT_FOLDER,RESULT_FILE);

async function stylesMaker(pathStyles, fileResult){
    const resultFile = fs.createWriteStream(fileResult,{encoding:'utf-8', flags: 'w+'});   
    try {
        const listFiles = await fsp.readdir(pathStyles,{withFileTypes: true});
        for (let i=0;i<listFiles.length;i++) {
            let pathFile=path.join(pathStyles,listFiles[i].name);
            let isCss=path.extname(pathFile)==CSS;
            if(listFiles[i].isFile() && isCss){
                let readFile=fs.createReadStream(pathFile,{encoding:'utf-8'}) 
                let rl = readline.createInterface({
                    input: readFile,
                    output: resultFile
                });
                rl.on('line', (line) => {
                    if(line != null)resultFile.write(line+"\n");
                });
                rl.on('error', function(err){
                    if(err.code == 'ENOENT'){
                        console.log("Файл не найден");
                    }else{
                        console.error(err);
                    }
                });
            }  
        }
    } catch (err) {
      console.error(err.message);
    }

}

stylesMaker(pathStyles, fileResult);