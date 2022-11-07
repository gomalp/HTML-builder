const fs = require('fs');
const path = require('path');
const { promises: fsp } = fs;
const readline = require('readline');

const RESULT_HTML="index.html";
const RESULT_CSS="style.css";
const TEMPLATE_HTML="template.html";
const RESULT_FOLDER="project-dist";
const SRC_STYLES_FOLDER="styles";
const ASSETS_FOLDER="assets"; 

const pathSrcStyles=path.join(__dirname,SRC_STYLES_FOLDER);

//const pathResultFolder=path.join(__dirname, SRC_STYLES_FOLDER);
const pathResultFolder=path.join(__dirname, RESULT_FOLDER);
const fileResultHtml=path.join(__dirname,RESULT_FOLDER,RESULT_HTML);
const fileTemplateHtml=path.join(__dirname,TEMPLATE_HTML);


async function htmlMaker(pathResultFolder, fileTemplateHtml,fileResultHtml){

    try {
        let templateData="";
        let chunk="";
        await fs.promises.mkdir(pathResultFolder, { recursive: true });  
        await eraseDir(pathResultFolder);
        const writeStream= fs.createWriteStream(fileResultHtml,{encoding:'utf-8', flags: 'w+'}); 
        const readStream=fs.createReadStream(fileTemplateHtml,{encoding:'utf-8'});

        readStream.on('readable', function(){
            while ((chunk=readStream.read()) != null) {
                templateData += chunk;
            }
        });
        readStream.on('end', function(){
            let tags=[];
            let pos=0;
            while(pos<templateData.length){
                let start= templateData.indexOf("{{", pos);
                let end=templateData.indexOf("}}", start+2);
                tags.push(templateData.slice(start+2, end));
                pos=end+2;
                console.log(tags);
                console.log(templateData.length);
                console.log(templateData);
                break;
            }

        }); 

        readStream.on('error', function(err){
            if(err.code == 'ENOENT'){
                console.log("Файл не найден");
            }else{
                console.error(err);
            }
        });

        

    } catch (err) {
        console.error("! error htmlMaker() function => ",err.message);
      }
}

async function eraseDir(targetFolderPath){
    try {
        const listFiles = await fs.promises.readdir(targetFolderPath, {withFileTypes: false});
        for (let i=0;i<listFiles.length;i++) {
          let file=path.join(targetFolderPath,listFiles[i]);
          fs.stat(file, async (err, stats) => {
            if(err){
              console.error("! error stat() into eraseDir function => ",err.message);   
              return;    
            }if (!stats.isDirectory()) {
              await fs.promises.unlink(file);
              console.log("- delete file: ",listFiles[i]);
            }           
          });
        }
    }  catch (err) {
      console.error("! error eraseDir() function => ",err.message);
    }
  }

htmlMaker(pathResultFolder, fileTemplateHtml,fileResultHtml);

/*

        const listFiles = await fs.promises.readdir(folderPath, {withFileTypes: false});
        
        for (let i=0;i<listFiles.length;i++) {
        let file=path.join(folderPath,listFiles[i]);
          fs.stat(file, async (err, stats) => {
            if(err){
              console.error("! error stat into copyDir() function => ",err.message);
              return;       
            }if (stats.isDirectory()) {
              await copyDir(file,path.join(targetFolderPath,listFiles[i]));
            } else {
              await fs.promises.copyFile( file, path.join(targetFolderPath,listFiles[i]));
              console.log(listFiles[i]," copied to ",targetFolderPath); 
            }
          });                        
        }
      } catch (err) {
        console.error("! error copyDir() function => ",err.message);
      }
}

async function cssMaker(pathStyles, fileResult){
    const resultFile = fs.createWriteStream(fileResult,{encoding:'utf-8', flags: 'w+'}); 
}

*/



  