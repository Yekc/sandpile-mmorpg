var items = require("../game_data/items.json")

getItem = function(id) {
    let item = items.find(i => i.id === id)

    if (!item) item = {
        id: "NULL",
        display: {
            name: "null"
        }
    }

    return item
}

give = async function(player, item, quantity) {
    try {
        const current = player.data.inventory[item] || 0
        player.data.inventory[item] = current + quantity
        log("\x1b[34minventory.js", "give", `Gave ${quantity} ${item} to ${player.username} (${player.userId})`)
        await save(player)
    } catch (error) {
        log("\x1b[34minventory.js", "give", `Failed to give ${quantity} ${item} to ${player.username} (${player.userId}): ${error}`, 3)
    }
}

remove = async function(player, item, quantity) {
    try {
        if (player.data.inventory[item]) {
            player.data.inventory[item] = current - quantity
            if (player.data.inventory[item] <= 0) delete player.data.inventory[item]
            log("\x1b[34minventory.js", "remove", `Removed ${quantity} ${item} from ${player.username} (${player.userId})`)
            await save(player)
        } else {
            log("\x1b[34minventory.js", "remove", `Failed to remove ${quantity} ${item} because player ${player.username} (${player.userId}) does not have any!`, 2)
        }
    } catch (error) {
        log("\x1b[34minventory.js", "remove", `Failed to remove ${quantity} ${item} from ${player.username} (${player.userId}): ${error}`, 3)
    }
}

sortAlphabetical = function(player, ascending = true) {
    const sortedInventory = Object.keys(player.data.inventory)
        .sort((a, b) => ascending 
            ? a.localeCompare(b) 
            : b.localeCompare(a)
        )
        .reduce((acc, key) => {
            acc[key] = player.data.inventory[key]
            return acc;
        }, {})

    player.data.inventory = sortedInventory
    log("\x1b[34minventory.js", "sortAlphabetical", `Inventory sorted ${ascending ? 'ascending' : 'descending'} for ${player.username} (${player.userId})`)
}

sortQuantity = function(player, ascending = true) {
    const sortedInventory = Object.keys(player.data.inventory)
        .sort((a, b) => ascending 
            ? player.data.inventory[a] - player.data.inventory[b]
            : player.data.inventory[b] - player.data.inventory[a]
        )
        .reduce((acc, key) => {
            acc[key] = player.data.inventory[key]
            return acc;
        }, {})

    player.data.inventory = sortedInventory
    log("\x1b[34minventory.js", "sortQuantity", `Inventory sorted ${ascending ? 'ascending' : 'descending'} for ${player.username} (${player.userId})`)
}