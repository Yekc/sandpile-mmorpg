const nh = require("node-hill-s")

nh.startServer({
    hostKey: "ZbqFHImC73riat2FphDPwKp0CwJlbyepiQoKY8G3S64fSiZT6idG5S6TTyQTDJJC",
    gameId: 9,
    port: 42480,
    local: false,
    mapDirectory: "./maps/",
    map: "test.brk",
    scripts: "./user_scripts",
    modules: [
        "mongoose"
    ]
})

// For more help: https://brickhill.gitlab.io/open-source/node-hill/interfaces/gamesettings.html
