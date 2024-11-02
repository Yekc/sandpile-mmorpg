setToolbarSlot = function(player, slot, item) {
    if (!player.data.toolbar[slot] == item) {
        player.data.toolbar[slot] = item
        log("inventory.js", "setToolbarSlot", `Set toolbar slot ${slot} to ${item} for ${player.username} (${player.userId})`)
        updateToolbar(player)
    } else {
        log("inventory.js", "setToolbarSlot", `Failed to set toolbar slot ${slot} to ${item} for ${player.username} (${player.userId}): Slot already occupied by ${item}`, 2)
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
            let item = item(tool)

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

            //Add tool
            let t = new Tool(toolName)
            if (!isNaN(item.display.model)) t.model = item.display.model
            player.addTool(t)
        })

        log("inventory.js", "updateToolbar", `Updated toolbar for ${player.username} (${player.userId})`)
    } catch (error) {
        log("inventory.js", "updateToolbar", `Failed to update toolbar for ${player.username} (${player.userId}): ${error}`, 3)
    }
}