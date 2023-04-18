const fs = require('fs-extra')
const path = require('path')

// list all file in all /NeverSink-Filter/ that begin with "NeverSink's filter - "
const files = fs.readdirSync(path.join(__dirname, 'NeverSink-Filter')).filter(file => file.startsWith("NeverSink's filter - "))

// load override file
const override_1 = fs.readFileSync(path.join(__dirname, 'override_1.filter'), 'utf8')
const override_2 = fs.readFileSync(path.join(__dirname, 'override_2.filter'), 'utf8')
const override_aw = fs.readFileSync(path.join(__dirname, 'override_aw.filter'), 'utf8')

// ensure build/normal and build/AW folder exist
fs.ensureDirSync(path.join(__dirname, 'build', 'normal'))
fs.ensureDirSync(path.join(__dirname, 'build', 'AW'))

// loop into each files
files.forEach(file => {
  // read file
  const data = fs.readFileSync(path.join(__dirname, 'NeverSink-Filter', file), 'utf8')
  const lineData = data.split('\r\n');
  // construct new file
  let newFileData = ''
  let newFileDataAW = ''

  // add each line into the new file until we find the line that started with:
  // # !! Override 010 : "ALL Rules"
  // then we insert content of override_1.filter
  // # !! Override 020 : "influenced rules"
  // then we insert content of override_2.filter
  // # !! Override 170 : "Overquality and endgame 4links"
  // then we insert content of override_aw.filter but only for the AW version
  for (let i = 0; i < lineData.length; i++) {
    newFileData += lineData[i] + '\r\n'
    newFileDataAW += lineData[i] + '\r\n'
    if (lineData[i].startsWith('# !! Override 010 : "ALL Rules"')) {
      newFileData += '\r\n' + override_1 + '\r\n'
      newFileDataAW += '\r\n' + override_1 + '\r\n'
    }
    if (lineData[i].startsWith('# !! Override 020 : "influenced rules"')) {
      newFileData += '\r\n' + override_2 + '\r\n'
      newFileDataAW += '\r\n' + override_2 + '\r\n'
    }
    if (lineData[i].startsWith('# !! Override 170 : "Overquality and endgame 4links"')) {
      newFileDataAW += '\r\n' + override_aw + '\r\n'
    }
  }
  
  // write new file
  fs.writeFileSync(path.join(__dirname, 'build', 'normal', file), newFileData)
  fs.writeFileSync(path.join(__dirname, 'build', 'AW', file), newFileDataAW)
});