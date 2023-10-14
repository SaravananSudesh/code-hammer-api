const router = require('express').Router()
const { execSync } = require("child_process")
const fs = require("fs")
const fsp = require('fs/promises')
var path = require('path')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

router.post('/', async (req, res) => {

    if (!req.body.code) return res.status(400).json({  message: "error", error: 'code' })

    const outputPath = path.join(__dirname, "outputs");

    var filepath = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

    var code = `
        ${req.body.imports || ''}
        public class ${filepath} {
            ${req.body.code}
        }
        `

    try {

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        await fsp.writeFile(outputPath + `/${filepath}.java`, code)

        const child = await execSync(`cd ${outputPath} && javac ${filepath}.java && java ${filepath}`, {encoding: "utf8"}).toString()

        fs.unlinkSync(outputPath + `/${filepath}.java`)
        fs.unlinkSync(outputPath + `/${filepath}.class`)

        res.status(200).json({  message: "success", result: child })
          

    } catch (error) {
        try {
            fs.unlinkSync(outputPath + `/${filepath}.java`)
            fs.unlinkSync(outputPath + `/${filepath}.class`)
        } catch (error) { }

        var errorOut = error.output[2] || "failed"

        res.status(400).json({  message: "error", error: errorOut })
    }

})

module.exports = router