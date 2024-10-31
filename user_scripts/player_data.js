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
    console.log("[PLAYER_DATA -> CONNECT] Attempting to establish connection with MongoDB...")
    mongoose.connect("mongodb+srv://yekware:GRkpLPA7f8o0fq7p@savedata1.mhvce.mongodb.net/?retryWrites=true&w=majority&appName=savedata1")
    .then(() => console.log("[PLAYER_DATA -> CONNECT] Connected to MongoDB!"))
    .catch(error => console.log(`[PLAYER_DATA -> CONNECT] Failed to connect to MongoDB: ${error}`))
}
connect()


save = async function(player) {
    try {
        const playerData = new Player(player.data)
        await playerData.save()
        console.log(`[PLAYER_DATA -> SAVE] Saved player data for ${player.username} (${player.userId})`)
    } catch (error) {
        console.log(`[PLAYER_DATA -> SAVE] Failed to save player data for ${player.username} (${player.userId}): ${error}`)
    }
}

saveAll = async function() {
    console.log("[PLAYER_DATA -> SAVE ALL] Saving player data for every player...")
    for (let i = 0; i < Game.players.length; i++) {
        await save(Game.players[i])
    }
    console.log("[PLAYER_DATA -> SAVE ALL] Saved player data for all players")
}

wipe = async function(player) {
    try {
        await Player.deleteOne({ userId: player.userId });
        console.log(`[PLAYER_DATA -> WIPE] Player data has been DELETED for ${player.username} (${player.userId})!!!`)
    } catch (error) {
        console.log(`[PLAYER_DATA -> WIPE] Failed to delete player data for ${player.username} (${player.userId})`)
    }
}


Game.on("playerJoin", async (player) => {
    //Look for player's data in the database
    let playerData = await Player.findOne({ userId: player.userId }).catch((error) => {
        player.message("\\c6Something went wrong when retreiving your player data!")
        player.message(`\\c6${error}`)
        player.kick("Something went wrong when retreiving your player data!")
    })

    if (playerData) {
        //Player has data saved
        if (playerData.version == currentVersion) {
            //Player data up-to-date
            player.data = playerData
        } else {
            //Player data needs to be updated
            try {
                let f = updates["from" + String(currentVersion - 1)]
                await f(player)
                console.log(`[PLAYER_DATA -> JOIN] Updated player data for ${player.username} (${player.userId})`)
                if (player.data.version < currentVersion) update(player)
            } catch (error) {
                console.log(`[PLAYER_DATA -> JOIN] Failed to update player data for ${player.username} (${player.userId}): ${error}`)
            }
        }
        console.log(`[PLAYER_DATA -> JOIN] Loaded player data for ${player.username} (${player.userId}) (v${player.data.version})`)
    } else {
        //New player
        let playerData = new Player({
            userId: player.userId,
            version: currentVersion,
            inventory: {}
        })
        await playerData.save()
        player.data = playerData
        console.log(`[PLAYER_DATA -> JOIN] Created player data for ${player.username} (${player.userId}) (v${player.data.version})`)
    }
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