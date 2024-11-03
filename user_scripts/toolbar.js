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

            //Add tool
            let t = new Tool(toolName)
            if (!isNaN(item.display.model)) t.model = item.display.model
            player.addTool(t)
        })

        log("\x1b[35mtoolbar.js", "updateToolbar", `Updated toolbar for ${player.username} (${player.userId}): ${player.data.toolbar}`)
    } catch (error) {
        log("\x1b[35mtoolbar.js", "updateToolbar", `Failed to update toolbar for ${player.username} (${player.userId}): ${error}`, 3)
    }
}