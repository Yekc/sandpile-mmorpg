const nh = require("node-hill-s")

nh.startServer({
    hostKey: "KWtPXIc8mwYHnddL9JjcI5mKp36vkzqNcCaeVqka2gxBRG9HKl84bjF1lfJ8hcSa",
    gameId: 69,
    port: 42480,
    local: true,
    mapDirectory: "./maps/",
    map: "test.brk",
    scripts: "./user_scripts",
    modules: [
        "mongoose"
    ]
})

// For more help: https://brickhill.gitlab.io/open-source/node-hill/interfaces/gamesettings.html
