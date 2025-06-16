const playerUsageCount = new Map();

function onUse(event) {
  let player = event.getPlayer();
  let playerId = player.getUniqueId();
  let item = player.getInventory().getItemInMainHand();
  let itemMeta = item.getItemMeta();
  let world = player.getWorld();
  let eyeLocation = player.getEyeLocation();
  let randomChance = Math.random();
  let probability = 0.01;
  if (!playerUsageCount.has(playerId)) {
    playerUsageCount.set(playerId, 0);
  }
  let usageCount = playerUsageCount.get(playerId) + 1;
  playerUsageCount.set(playerId, usageCount);

  const lore = itemMeta.getLore().slice(0, -2);
  lore.push("§e║§x§c§2§2§a§f§b你已手冲:" + usageCount + "次");
  lore.push('§e╚════════════════════════════════════╝');
  itemMeta.setLore(lore);
  item.setItemMeta(itemMeta);

  if (randomChance < probability) {
    let llamaspit = world.spawn(eyeLocation, org.bukkit.entity.LlamaSpit);
    llamaspit.setCustomName("精液");

    org.bukkit.Bukkit.broadcastMessage(`${player.getName()}冲了${usageCount}次,终于射出来了`);

    if (player.getFoodLevel() <= 0) {
      player.setHealth(0);
      org.bukkit.Bukkit.broadcastMessage(player.getName() + "死于手冲过度");
      playerUsageCount.set(playerId, 0);
    } else {
      player.setFoodLevel(0);
      player.setSaturation(0);
    }
  }
}