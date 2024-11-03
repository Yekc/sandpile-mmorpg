const itemActions = {
    test: function(player) {
        player.message("test")
    },
    equip: function(player) {
        player.message("equip")
    },
    unequip: function(player) {
        player.message("unequip")
    }
}

updateToolbar = function(player) {
    try {
        //Destroy all current tools
        while(player.inventory.length) {
            player.destroyTool(player.inventory[player.inventory.length - 1])
        }

        //Add tools
        player.data.toolbar.forEach(tool => {
            let item = getItem(tool)

            //Set tool display name
            let toolName = ""
            for (word of item.display.name.split(" ")) {
                if (word.length > 3) {
                    toolName += word + "\n"
                } else {
                    toolName += word + " "
                }
            }
            if (toolName == "") toolName = " "
            if (player.data.inventory[tool] > 1) toolName += ` (x${player.data.inventory[tool]})`

            //Create tool
            let t = new Tool(toolName)

            //Set actions
            if (item.actions.activate != "") {
                t.on("activated", () => {
                    let action = itemActions[item.actions.activate]
                    if (action) action(player)
                })
            }
            if (item.actions.equip != "") {
                t.on("equipped", () => {
                    let action = itemActions[item.actions.equip]
                    if (action) action(player)
                })
            }
            if (item.actions.unequip != "") {
                t.on("unequipped", () => {
                    let action = itemActions[item.actions.unequip]
                    if (action) action(player)
                })
            }

            //Set model
            if (!isNaN(item.display.model)) t.model = item.display.model

            //Add tool to toolbar
            player.addTool(t)
        })

        log("\x1b[35mtoolbar.js", "updateToolbar", `Updated toolbar for ${player.username} (${player.userId}): ${player.data.toolbar}`)
    } catch (error) {
        log("\x1b[35mtoolbar.js", "updateToolbar", `Failed to update toolbar for ${player.username} (${player.userId}): ${error}`, 3)
    }
}