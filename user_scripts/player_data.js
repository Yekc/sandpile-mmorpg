const mongoose = getModule("mongoose")

const currentVersion = 0
const playerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    version: {
        type: Number,
        required: true,
    },
    inventory: {
        type: Object,
        default: {}
    },
    toolbar: {
        type: [String],
        default: []
    }
})
const Player = mongoose.model("Player", playerSchema)

//For updating player data to new schema versions
const updates = {
    /*
    from0: async function(player) {
        let playerData = await Player.findOne({ userId: player.userId })

        if (playerData) {
            playerData.version = currentVersion
        }
        await playerData.save()

        player.data = playerData
    }
    */
}


//Connect to MongoDB
connect = async() => {
    log("player_data.js", "connect", "Attempting to establish connection with MongoDB...", 1)
    mongoose.connect("mongodb+srv://yekware:GRkpLPA7f8o0fq7p@savedata1.mhvce.mongodb.net/?retryWrites=true&w=majority&appName=savedata1")
    .then(() => log("player_data.js", "connect", "Connected to MongoDB!"))
    .catch(error => log("player_data.js", "connect", `Failed to connect to MongoDB: ${error}`, 3))
}
connect()


save = async function(player) {
    try {
        await Player.updateOne(
            { userId: player.userId },
            { $set: player.data }
        )
        log("player_data.js", "save", `Saved player data for ${player.username} (${player.userId})`)
    } catch (error) {
        log("player_data.js", "save", `Failed to save player data for ${player.username} (${player.userId}): ${error}`, 3)
    }
}

saveAll = async function() {
    log("player_data.js", "saveAll", "Saving player data for every player...", 1)
    for (let i = 0; i < Game.players.length; i++) {
        await save(Game.players[i])
    }
    log("player_data.js", "saveAll", "Saved player data for all players")
}

wipe = async function(player) {
    try {
        await Player.deleteOne({ userId: player.userId })
        let playerData = new Player()
        playerData.userId = player.userId
        playerData.version = currentVersion
        await playerData.save()
        player.kick("Your data has been wiped by an admin!")
        log("player_data.js", "wipe", `Player data has been DELETED for ${player.username} (${player.userId})!!!`, 2)
    } catch (error) {
        log("player_data.js", "wipe", `Failed to delete player data for ${player.username} (${player.userId}): ${error}`, 3)
    }
}


Game.on("playerJoin", async (player) => {
    player.loadTool = false

    //Look for player's data in the database
    let playerData = await Player.findOne({ userId: player.userId }).catch((error) => {
        player.message("\\c6Something went wrong when retreiving your player data!")
        player.message(`\\c6${error}`)
        player.kick("Something went wrong when retreiving your player data!")
        log("player_data.js", "Game.on(\"playerJoin\")", `Failed to retreive player data for ${player.username} (${player.userId})`, 3)
    })

    if (playerData) {
        //Player has data saved
        if (playerData.version == currentVersion) {
            //Player data up-to-date
            player.data = playerData
        } else {
            //Player data needs to be updated
            try {
                let f = updates[`from${currentVersion - 1}`]
                await f(player)
                log("player_data.js", "Game.on(\"playerJoin\")", `Updated player data for ${player.username} (${player.userId})`)
                if (player.data.version < currentVersion) update(player)
            } catch (error) {
                log("player_data.js", "Game.on(\"playerJoin\")", `Failed to update player data for ${player.username} (${player.userId}): ${error}`, 3)
            }
        }
        log("player_data.js", "Game.on(\"playerJoin\")", `Loaded player data for ${player.username} (${player.userId}) (v${player.data.version})`)
    } else {
        //New player
        let playerData = new Player()
        playerData.userId = player.userId
        playerData.version = currentVersion
        await playerData.save()
        player.data = playerData
        log("player_data.js", "Game.on(\"playerJoin\")", `Created player data for ${player.username} (${player.userId}) (v${player.data.version})`)
    }

    updateToolbar(player)

    player.emit("Loaded")
})


//Autosave
setInterval(() => {
    //Done like this to avoid having to wait for all saving
    Game.players.forEach((player) => {
        save(player)
    })
}, 30000)

//Save when player leaves the game
Game.on("playerLeave", (player) => {
    save(player)
})

//Save when server closes
Game.bindToClose(async() => {
    await saveAll()

    //Disconnect from MongoDB
    await mongoose.connection.close()
})