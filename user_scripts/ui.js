//Maximum items in a menu page
const pageCount = 10

//Menu type enum
const menus = Object.freeze({
    NONE: 0,
    INVENTORY: 1
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

        //UI loop
        setInterval(() => {
            player.ui.invPageCount = Math.ceil(Object.values(player.data.inventory).length / pageCount)

            let draw = ""

            switch (player.ui.menu) {
                //Inventory
                case 1:
                    draw += "#\\c1|\\c2===\\c1| \\c9Inventory \\c1|\\c2====================\\c1|#"

                    let pageItems = Object.keys(player.data.inventory).slice(1 * player.ui.invPage - 1, pageCount * player.ui.invPage)
                    for (let i = 0; i < pageItems.length; i++) {
                        draw += `#\\c1[\\c7${i + 1}\\c1] \\c0${item(pageItems[i]).display.name} \\c0(${player.data.inventory[pageItems[i]]})`
                    }

                    draw += `##\\c0Page ${player.ui.invPage == 1 ? "\\c1" : ""}< \\c0${player.ui.invPage}/${player.ui.invPageCount} ${player.ui.invPage == player.ui.invPageCount ? "\\c1" : ""}>    \\c1Use \\c7X \\c1and \\c7C \\c1to scroll through the pages`
                    draw += "#\\c1Press \\c7E \\c1to close your inventory"
                    break
            }

            player.centerPrint(draw)
        }, 100)

        //Keyboard input
        player.keypress(async(key) => {
            switch (key) {
                //Toggle inventory
                case "e":
                    player.ui.menuOpened = !player.ui.menuOpened;
                    player.ui.menu = player.ui.menuOpened ? 1 : 0;
                    break
                
                //Page left
                case "x":
                    if (player.ui.invPage > 1) player.ui.invPage--
                    break

                //Page right
                case "c":
                    if (player.ui.invPage < player.ui.invPageCount) player.ui.invPage++
                    break
            }
        })
    })
})