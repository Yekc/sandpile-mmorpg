let items = require("../game_data/items.json")

item = function(id) {
    return items.find(i => i.id === id)
}

give = async function(player, item, quantity) {
    try {
        const current = player.data.inventory[item] || 0
        player.data.inventory[item] = current + quantity
        console.log(`[INVENTORY -> GIVE] Gave ${quantity} ${item} to ${player.username} (${player.userId})`)
        await save(player)
    } catch (error) {
        console.log(`[INVENTORY -> GIVE] Failed to give ${quantity} ${item} to ${player.username} (${player.userId}): ${error}`)
    }
}

remove = async function(player, item, quantity) {
    try {
        if (player.data.inventory[item]) {
            player.data.inventory[item] = Math.max(current - quantity, 0)
            console.log(`[INVENTORY -> REMOVE] Removed ${quantity} ${item} from ${player.username} (${player.userId})`)
            await save(player)
        } else {
            console.log(`[INVENTORY -> REMOVE] Failed to remove ${quantity} ${item} because player ${player.username} (${player.userId}) does not have any!`)
        }
    } catch (error) {
        console.log(`[INVENTORY -> REMOVE] Failed to remove ${quantity} ${item} from ${player.username} (${player.userId}): ${error}`)
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
    console.log(`[INVENTORY -> SORT ALPHABETICAL] Inventory sorted ${ascending ? 'ascending' : 'descending'} for ${player.username} (${player.userId})`)
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
    console.log(`[INVENTORY -> SORT QUANTITY] Inventory sorted ${ascending ? 'ascending' : 'descending'} for ${player.username} (${player.userId})`)
}