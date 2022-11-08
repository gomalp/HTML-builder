const fs = require('fs');
const path = require('path');
const { promises: fsp } = fs;
const PATH=path.join(__dirname,"secret-folder");

(async () => {
    try {
        const promise = fsp.readdir(PATH,{withFileTypes: true});   
        const listFiles = await promise;
        for (let i=0;i<listFiles.length;i++) {
            if(listFiles[i].isFile()){
                let name=listFiles[i].name;
                let stat = await fsp.stat(path.join(PATH,listFiles[i].name));
                console.log(path.parse(name).name," - ",
                            path.extname(name).replace('.', '')," - ",
                            (stat.size/1024).toFixed(3),"kb")
            }
        }
    } catch (err) {
      console.error(err.message);
    }
  })()