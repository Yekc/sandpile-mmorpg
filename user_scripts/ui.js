//Maximum items in a menu page
const pageCount = 10

//Menu type enum
const menus = Object.freeze({
    NONE: 0,
    INVENTORY: 1,
    ITEM: 2
})

Game.on("playerJoin", (player) => {
    player.on("Loaded", () => {
        //Create UI class
        player.ui = {}

        //Menu variables
        player.ui.menu = menus.NONE
        player.ui.menuOpened = false

        //Inventory variables
        player.ui.invPage = 1
        player.ui.invPageCount = 1
        player.ui.invItem = ""

        //UI loop
        setInterval(() => {
            player.ui.invPageCount = Math.max(Math.ceil(Object.values(player.data.inventory).length / pageCount), 1)

            let draw = ""

            switch (player.ui.menu) {
                case menus.INVENTORY:
                    draw += "#\\c1|\\c2===\\c1| \\c9Inventory \\c1|\\c2====================\\c1|"
                    draw += "#\\c1Press the number next to an item to view more information about it#"

                    let pageItems = Object.keys(player.data.inventory).slice(pageCount * (player.ui.invPage - 1), pageCount * player.ui.invPage)
                    for (let i = 0; i < pageItems.length; i++) {
                        draw += `#\\c1[\\c7${i + 1}\\c1] \\c0${getItem(pageItems[i]).display.name} \\c0(${player.data.inventory[pageItems[i]]})`
                    }

                    draw += `##\\c0Page ${player.ui.invPage == 1 ? "\\c1" : ""}< \\c0${player.ui.invPage}/${player.ui.invPageCount} ${player.ui.invPage == player.ui.invPageCount ? "\\c1" : ""}>    \\c1Use \\c7X \\c1and \\c7C \\c1to scroll through the pages`
                    draw += "#\\c1Press \\c7E \\c1to close your inventory"
                    break
                
                case menus.ITEM:
                    draw += "#\\c1|\\c2===\\c1| \\c9Inventory \\c1|\\c2====================\\c1|"
                    draw += "#\\c1Press \\c7E \\c1to go back to your inventory#"

                    let item = getItem(player.ui.invItem)

                    draw += `#\\c0${item.display.name}#\\c1Amount: \\c0${player.data.inventory[player.ui.invItem]}#`
                    draw += `#\\c1${item.display.description}#`

                    let slot = player.data.toolbar.indexOf(player.ui.invItem)
                    if (slot != -1) {
                        draw += `#\\c5You currently have this item equipped in your toolbar! (Slot ${slot + 1})`
                    }

                    draw += `#\\c1[\\c71-9\\c1] \\c0${slot == -1 ? "Equip item in" : "Remove item from"} toolbar`
                    draw += "#\\c1[\\c7E\\c1] \\c0Go back to inventory"
                    break
            }

            player.centerPrint(draw)
        }, 100)

        //Keyboard input
        player.keypress(async(key) => {
            //Number key
            if (!isNaN(parseFloat(key))) {
                switch (player.ui.menu) {
                    case menus.INVENTORY:
                        player.ui.invItem = Object.keys(player.data.inventory).slice(pageCount * (player.ui.invPage - 1), pageCount * player.ui.invPage)[Number(key) - 1]
                        player.ui.menu = menus.ITEM
                        break
                    case menus.ITEM:
                        let slot = player.data.toolbar.indexOf(player.ui.invItem)
                        if (Number(key) - 1 == slot || (Number(key) - 1 > player.data.toolbar.length && slot != -1)) {
                            //Remove from the toolbar
                            player.data.toolbar = player.data.toolbar.filter(id => id !== player.ui.invItem)
                        } else {
                            if (slot != -1) {
                                //Move to another slot in the toolbar
                                player.data.toolbar = player.data.toolbar.filter(id => id !== player.ui.invItem)
                                player.data.toolbar[Number(key) - 1 > player.data.toolbar.length ? player.data.toolbar.length : Number(key) - (Number(key) > slot + 1 ? 2 : 1)] = player.ui.invItem
                            } else {
                                //Add to toolbar
                                player.data.toolbar[Number(key) - 1 > player.data.toolbar.length ? player.data.toolbar.length : Number(key) - 1] = player.ui.invItem
                            }
                        }
                        updateToolbar(player)
                        break
                }
            }

            switch (key) {
                //Toggle inventory
                case "e":
                    switch (player.ui.menu) {
                        case menus.INVENTORY:
                        case menus.NONE:
                            player.ui.menuOpened = !player.ui.menuOpened
                            player.ui.menu = player.ui.menuOpened ? menus.INVENTORY : menus.NONE
                            break
                        case menus.ITEM:
                            player.ui.menu = menus.INVENTORY
                            break
                    }
                    break
                
                //Page left
                case "x":
                    if (player.ui.menu == menus.INVENTORY && player.ui.invPage > 1) player.ui.invPage--
                    break

                //Page right
                case "c":
                    if (player.ui.menu == menus.INVENTORY && player.ui.invPage < player.ui.invPageCount) player.ui.invPage++
                    break
            }
        })
    })
})