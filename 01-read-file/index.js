const fs = require('fs');
const path = require('path');

let stream=fs.createReadStream(path.join(__dirname,"text.txt"),{encoding:'utf-8'})   // создаем экземпляр ReadStream
 
stream.on('readable', function(){
    let data = stream.read();
    if(data != null)console.log(data);
});
 
stream.on('error', function(err){
    if(err.code == 'ENOENT'){
        console.log("Файл не найден");
    }else{
        console.error(err);
    }
});


