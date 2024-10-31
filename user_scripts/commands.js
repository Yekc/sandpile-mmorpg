//shutdown
Game.command("shutdown", async(player) => {
    if (player.userId > 2) return

    player.message("\\c1Saving for all players...")
    await saveAll()
    player.message("\\c5All players had their data saved!")
    
    Game.players.messageAll("\\c6This game was shutdown by an admin!")
    Game.shutdown()
})

//save [player]
Game.command("save", async(player, a) => {
    if (player.userId > 2) return
    let args = a.split(' ')

    if (args[0] != "") {
        let p = Game.players.find(p => p.username === args[0])
        if (!p) {
            player.message("\\c6Player does not exist!")
            return
        }

        player.message("\\c1Saving...")
        await save(p)
        player.message(`\\c5Saved player data for ${args[0]}!`)
        p.message("\\c5Your player data was saved by an admin!")
    } else {
        player.message("\\c1Saving...")
        await save(player)
        player.message("\\c5Saved!")
    }
})

//saveall
Game.command("saveall", async(player) => {
    if (player.userId > 2) return
    player.message("\\c1Saving for all players...")
    await saveAll()
    player.message("\\c5All players had their data saved!")
})

//wipe [player]
Game.command("wipe", async(player, a) => {
    if (player.userId > 2) return
    let args = a.split(' ')

    if (args[0] != "") {
        let p = Game.players.find(p => p.username === args[0])
        if (!p) {
            player.message("\\c6Player does not exist!")
            return
        }
        
        player.message("\\c1Wiping player data...")
        await wipe(p)
        player.message(`\\c6Player data wiped for ${args[0]}!`)
        p.message("\\c6Your player data was wiped by an admin!")
    } else {
        player.message("\\c1Wiping player data...")
        await wipe(player)
        player.message("\\c6Player data wiped!")
    }
})

//give [player] (item) (amount)
Game.command("give", async(player, a) => {
    if (player.userId > 2) return
    let args = a.split(' ')

    if (args.length > 2) {
        let p = Game.players.find(p => p.username === args[0])
        if (!p) {
            player.message("\\c6Player does not exist!")
            return
        }
        
        player.message("\\c1Giving items...")
        await grant(p, args[1], Number(args[2]))
        player.message(`\\c5Gave ${args[0]} ${args[2]} ${args[1]}!`)
        p.message(`\\c5You were granted ${args[2]} ${args[1]} by an admin!`)
    } else {
        if (args.length < 2) {
            player.message("\\c6Missing arguments!")
            return
        }
        player.message("\\c1Giving items...")
        await grant(player, args[0], Number(args[1]))
        player.message(`\\c5Gave ${args[1]} ${args[0]}!`)
    }
})

//revoke [player] (item) (amount)
Game.command("remove", async(player, a) => {
    if (player.userId > 2) return
    let args = a.split(' ')

    if (args.length > 2) {
        let p = Game.players.find(p => p.username === args[0])
        if (!p) {
            player.message("\\c6Player does not exist!")
            return
        }
        
        player.message("\\c1Removing items...")
        await remove(p, args[1], Number(args[2]))
        player.message(`\\c5Removed ${args[2]} ${args[1]} from ${args[0]}!`)
        p.message(`\\c5Your ${args[2]} ${args[1]} was removed by an admin!`)
    } else {
        if (args.length < 2) {
            player.message("\\c6Missing arguments!")
            return
        }
        player.message("\\c1Removing items...")
        await remove(player, args[0], Number(args[1]))
        player.message(`\\c5Removed ${args[1]} ${args[0]}!`)
    }
})