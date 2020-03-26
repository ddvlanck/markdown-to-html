const fs = require('fs');
const program = require('commander');

program
    .version("1.0.0")
    .usage("This program transforms a markdown file to HTML")
    .option('-f, --file <target>', "Markdown file that has to been transformed to HTML")
    .option('-o, --output <target>', 'Filename of the HTML page')

program.on('--help', () => {
    //TODO
});

program.parse(process.argv);

const markdownFile = program.file || console.error('Please provide a markdown file');
if(markdownFile.indexOf('.md') < 0){
    console.error('This file is not a markdown file. Markdown files should have an .md extension');
    process.exit();
}

const output = program.output || 'html-page.html';

fs.readFile(markdownFile, 'utf8', (err, data) => {
   if(err){
       console.error(err);
       process.exit();
   }
   transformData(data);
});

function transformData(data){
    // Check if data contains references
    if(data.indexOf('](') >= 0){
        const references = data.match(/\[.*\]\([^\)]*\)/gm);
        for(let index in references) {
            const reference = references[index];
            const link = '<a href="' + reference.substring(reference.indexOf('(') + 1, reference.indexOf(')')) + '">' + reference.substring(reference.indexOf('[') + 1, reference.indexOf(']')) + '</a>'
            data = data.replace(reference, link);
        }
    }

    // Write the result to the specified file
    fs.writeFile(output, data, (err) => {
        if(err){
            console.error(err);
            process.exit();
        }
        console.log("References in markdown were transformed to links in HTML. Data saved to " + output);
    })
}
