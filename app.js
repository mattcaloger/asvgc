const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const fs = require('fs');
const path = require('path');

let folder = null
let destination = null

replacements = [
    {
        origin:"xmlns:xlink", 
        replacement: "xmlnsxlink"
    },
    {
        origin:"xml:space", 
        replacement: "xmlspace"
    },
    {
        origin:"xmlns:serif", 
        replacement: "xmlnsserif"
    },
]

// set up folder
if(process.argv[2]) {
    if(process.argv[2] === "help") {
        console.log("asvgc [relative folder] or asvgc to run in current working directory.")
        process.exit()
    }
    folder = process.argv[2]
} else {
    folder = process.cwd()
}

let writeFile = (file, contents) => {
    fs.writeFile(file, contents, 'utf-8', function(err, data) {
        if (err) throw err;

        let filename = file.split("\\")
        filename = filename[filename.length-1]

        console.log(filename, "has been fixed.")
    })
}

fs.readdir(folder, (err, files) => {
    if (err) throw err

    // loop through files in given folder
    files.forEach(file => {

        // check for .svg extension
        if(path.extname(file) === ".svg") {
            let folderPath = path.resolve(folder, file)

            // read svg files
            fs.readFile(folderPath, 'utf-8', (err, data) => {
                if (err) throw err

                // set original text
                newText = data

                // loop through replacements
                replacements.forEach((replacer => {
                    let reg = new RegExp(replacer.origin, 'gim')
                    newText = newText.replace(reg, replacer.replacement)
                }))

                // write updated file
                writeFile(folderPath, newText)
            })
        }
    });
})