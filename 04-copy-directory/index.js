const fs = require('fs');
const path = require('path');

const FOLDER="files";
const TARGET_FOLDER="files-copy";

const folderPath=path.join(__dirname, FOLDER);
const targetFolderPath=path.join(__dirname, TARGET_FOLDER);

async function copyDir(folderPath, targetFolderPath){
    try {
        await fs.promises.mkdir(targetFolderPath, { recursive: true });  
        const listFiles = await fs.promises.readdir(folderPath, {withFileTypes: false});
        await eraseDir(targetFolderPath);
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

copyDir(folderPath,targetFolderPath);