// 全局变量存储配置
var oreDropsConfig = {};

function onToolUse(event, item, fortune, drops) {
    try {
        let player = event.getPlayer();
        let block = event.getBlock();
        
        // 从配置获取掉落信息
        let config = getAddonConfig();
        oreDropsConfig = config.getConfigurationSection("ore-drops").getValues(false);
        
        processOreDrops(player, block);
    } catch (e) {
        console.error("处理矿石掉落时出错:", e);
    }
}

// 处理矿石掉落
function processOreDrops(player, block) {
    let blockType = block.getType().toString();
    let drops = oreDropsConfig[blockType];
    
    if (!drops) return;
    
    let location = block.getLocation();
    let dropCount = 0;

    drops.forEach(drop => {
        if (Math.random() * 100 <= drop.probability) {
            let sfItem = getSfItemById(drop.item);
            if (sfItem) {
                block.getWorld().dropItemNaturally(location, sfItem.getItem().clone());
                dropCount++;
                player.sendMessage(`§a✔ 获得 ${drop.item}`);
            }
        }
    });

    if (dropCount > 0) {
        player.sendMessage(`[矿石掉落] ${player.getName()} 挖掘 ${blockType} 获得 ${dropCount} 种特殊材料`);
    }
}