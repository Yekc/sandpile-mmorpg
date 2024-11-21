let npcs = require("../game_data/npcs.json")
let outfits = require("../game_data/outfits.json")

const MOB_CAP = 100

let rangeBricks = []
let spawnerBricks = []
let npcBricks = []

//Collect and hide range/spawner/npc bricks
prepareBots = function() {
    const brickMappings = [
        { collection: rangeBricks, prefix: "range_" },
        { collection: spawnerBricks, prefix: "spawn_" },
        { collection: npcBricks, prefix: "npc_" }
    ]

    brickMappings.forEach(({ collection, prefix }) => {
        collection.push(...[], ...Game.world.bricks.filter(brick => brick.name.startsWith(prefix)))
        collection.forEach(brick => brick.setVisibility(0))
    })
}

getOutfit = function(id) {
    current = outfits.find(outfit => outfit.id == id)

    return new Outfit()
        .head(current.bodyColors.head)
        .torso(current.bodyColors.torso)
        .leftArm(current.bodyColors.leftArm)
        .rightArm(current.bodyColors.rightArm)
        .leftLeg(current.bodyColors.leftLeg)
        .rightLeg(current.bodyColors.rightLeg)

        .clothing1(current.clothing.clothing1)
        .clothing2(current.clothing.clothing2)
        .clothing3(current.clothing.clothing3)
        .clothing4(current.clothing.clothing4)
        .clothing5(current.clothing.clothing5)
        
        .face(current.items.face)
        .hat1(current.items.hat1)
        .hat2(current.items.hat2)
        .hat3(current.items.hat3)
}

//Spawn mobs
startMobs = function() {
    for (let i = 0; i < MOB_CAP; i++) {
        const zombie = new Bot("Zombie")

        const outfit = new Outfit()
        .body("#0d9436")
        .torso("#694813")
        .rightLeg("#694813")
        .leftLeg("#694813")

        zombie.setOutfit(outfit)

        Game.newBot(zombie)

        zombie.setInterval(() => {
            let target = zombie.findClosestPlayer(20)
          
            if (!target) return zombie.setSpeech("")
          
            zombie.setSpeech("BRAAINNNSSS!")
          
            zombie.moveTowardsPlayer(target, 8)
        }, 10)
    }
}
startMobs()