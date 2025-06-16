const lastUseTimes = new Map();

function onUse(event) {
  const player = event.getPlayer();
  const playerId = player.getUniqueId(); // 使用玩家的UUID作为唯一标识符
  const currentTime = new Date().getTime();

  if (lastUseTimes.has(playerId)) {
    const lastUseTime = lastUseTimes.get(playerId);
    if (currentTime - lastUseTime < 150000) {
      const remainingTime = Math.ceil((150000 - (currentTime - lastUseTime)) / 1000);
      player.sendTitle("§c§l你干嘛啊~哎呦！", `冷却剩余时间： ${remainingTime}秒`, 0, 10, 0);
      const item = player.getInventory().getItemInMainHand();
      const itemMeta = item.getItemMeta();
      const lore = itemMeta.getLore().slice(0, -2);
      lore.push(`§e║§9§l冷却剩余时间 : ${remainingTime}`);
      lore.push('§e╚═══════════════════════════════════════╝')
      itemMeta.setLore(lore);
      item.setItemMeta(itemMeta);
      return; 
    }
  }

  lastUseTimes.set(playerId, currentTime);

  let entities = player.getNearbyEntities(3, 3, 3);
  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Chicken && !entity.isAdult()) {
      entity.setAdult();
    }
  }
}