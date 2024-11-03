//Console printing
log = function(file, method, content, type = 0) {
    let color = ""
    switch (type) {
        //Green
        case 0:
            color = "\x1b[32m"
            break
        //Gray
        case 1:
            color = "\x1b[90m"
            break
        //Yellow
        case 2:
            color = "\x1b[33m"
            break
        //Red
        case 3:
            color = "\x1b[31m"
            break
    }
    console.log(`\x1b[90m[${file}\x1b[90m -> ${method}\x1b[90m] \x1b[1m${color}${content}\x1b[0m`)
}


//ADMIN COMMANDS

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
        await give(p, args[1], Number(args[2]))
        player.message(`\\c5Gave ${args[0]} ${args[2]} ${args[1]}!`)
        p.message(`\\c5You were granted ${args[2]} ${args[1]} by an admin!`)
    } else {
        if (args.length < 2) {
            player.message("\\c6Missing arguments! /give [player] (item) (amount)")
            return
        }
        player.message("\\c1Giving items...")
        await give(player, args[0], Number(args[1]))
        player.message(`\\c5Gave ${args[1]} ${args[0]}!`)
    }
})

//remove [player] (item) (amount)
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
            player.message("\\c6Missing arguments! /remove [player] (item) (amount)")
            return
        }
        player.message("\\c1Removing items...")
        await remove(player, args[0], Number(args[1]))
        player.message(`\\c5Removed ${args[1]} ${args[0]}!`)
    }
})


//PLAYER COMMANDS

//inv [page]
//inventory [page]
Game.command(["inv", "inventory"], async(player, a) => {
    let args = a.split(' ')

    if (!isNaN(parseFloat(args[0])) && Number(args[0]) <= player.ui.invPageCount) {
        player.ui.invPage = Number(args[0])
    } else {
        player.message("\\c6Invalid arguments! /inv [page]")
    }

    player.ui.menuOpened = true
    player.ui.menu = 1
})