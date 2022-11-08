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
const SRC_TEGS_FOLDER="components"; 

const pathSrcTegsFolder=path.join(__dirname,SRC_TEGS_FOLDER);
const pathSrcStylesFolder=path.join(__dirname, SRC_STYLES_FOLDER);
const pathResultFolder=path.join(__dirname, RESULT_FOLDER);
const fileResultHtml=path.join(__dirname,RESULT_FOLDER,RESULT_HTML);
const fileTemplateHtml=path.join(__dirname,TEMPLATE_HTML);


async function htmlMaker(pathResultFolder, fileTemplateHtml,fileResultHtml,pathSrcTegsFolder){

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
        readStream.on('end', async function(){
            let tags=[];
            let tagsCode=[];
            let index="";
            let start=templateData.indexOf("{{", 0);
            let end=templateData.indexOf("}}", start+2);
            //let item=templateData.indexOf("{{", pos);
            index=templateData.slice(0, start);
            while(start!=-1){
                
                tags.push({tag: templateData.slice(start+2, end),start: start+2,end: end});
                start= templateData.indexOf("{{", end+2);
                end=templateData.indexOf("}}", start+2);

                console.log(tags);
                console.log(templateData.length);      
            }
                    // node 06-build-page

            //let readStream=fs.createReadStream(pathSrcStylesFolder,{encoding:'utf-8'});
            await (async () => {
            const listFiles = await fsp.readdir(pathSrcTegsFolder,{withFileTypes: true});            
            for (let i=0;i<listFiles.length;i++) {
                let pathFileTag=path.join(pathSrcTegsFolder,listFiles[i].name);
                let isHtml=path.extname(pathFileTag)==".html";
                if(listFiles[i].isFile() && isHtml){
                  console.log("pathFileTag   ",pathFileTag)
                    let readFileTag=fs.createReadStream(pathFileTag,{encoding:'utf-8'}) 
                    let templateDataTeg=0;
                    let chunkTeg="";
                    readFileTag.on('readable', function(){
                      while ((chunkTeg=readFileTag.read()) != null) {
                        templateDataTeg += chunkTeg;
                      }
                    });

                    readFileTag.on('end', function(){
                      tagsCode.push(templateDataTeg);
                      console.log("---",templateDataTeg);
                      
                    });
                    readFileTag.on('error', function(err){
                      if(err.code == 'ENOENT'){
                        console.log("Файл не найден");
                      }else{
                       console.error(err);
                      }
                    });
                }  
                console.log("########## 0 ",tagsCode[0]);
                console.log("########## 1 ",tagsCode[1]);
                console.log("########## 2 ",tagsCode[2]);
         } })()

 


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

  htmlMaker(pathResultFolder, fileTemplateHtml,fileResultHtml,pathSrcTegsFolder);

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



  