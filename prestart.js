const fs = require("fs");
const path = require("path");
const diff = require('diff');

const componentsDir1 = path.join(__dirname, "src", "components");
const componentsDir2 = "../quierounturno-admin/src/components";

fs.readdir(componentsDir1, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  fs.readdir(componentsDir1, (err, files2) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    files2.forEach((file2) => {
        const filePath1 = path.join(componentsDir1, file2);
        const filePath2 = path.join(componentsDir2, file2);

        const fileContent1 = fs.readFileSync(filePath1, 'utf8');
        const fileContent2 = fs.readFileSync(filePath2, 'utf8');

        if (fileContent1 !== fileContent2) {
            const differences = diff.diffLines(fileContent1, fileContent2);

            differences.forEach((part) => {
                // Display differences
                if (part.added) {
                    console.log(`Added: ${part.value}`);
                } else if (part.removed) {
                    console.log(`Removed: ${part.value}`);
                }
            });

            fs.stat(filePath1, (err, stats1) => {
                if (err) return
                fs.stat(filePath2, (err, stats2) => {
                if (err) return

                const mTime1 = new Date(stats1.mtime);
                const mTime2 = new Date(stats2.mtime);
                if (mTime1 > mTime2) {
                    console.log(`Replaced ${filePath2} with file content from ${filePath1}`);
                    //replaceFileContent(filePath2, fileContent1);
                } else {
                    console.log(`Replaced ${filePath1} with file content from ${filePath2}`);
                    //replaceFileContent(filePath1, fileContent2);
                }
                });
            });
        }
    })
  });
});

const replaceFileContent = (file, newFileContent) => {
    // Read the existing content of the file
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${file}:`, err);
            return;
        }

        // Write the new content to the file
        fs.writeFile(file, newFileContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing to file ${file}:`, err);
                return;
            }
            console.log(`Content of file ${file} replaced successfully.`);
        });
    });
};