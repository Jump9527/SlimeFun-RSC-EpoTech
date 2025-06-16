let usageCount = 0;
const drillData = {
  "JP_手电钻": { depth: 10000, probability: 0.1 },
  "JP_手电钻+1": { depth: 1000, probability: 0.1 },
  "JP_手电钻+2": { depth: 100, probability: 0.1 },
  "JP_手电钻+3": { depth: 100, probability: 1 }
};

function onUse(event) {
  let player = event.getPlayer();
  if (event.getHand() !== org.bukkit.inventory.EquipmentSlot.HAND) {
    player.sendMessage("主手请持物品");
    return;
  }

  let playerY = player.getLocation().getY();
  if (playerY > -40) {
    player.sendMessage("开采坐标过低,需要更深入点~");
    return;
  }

  let item = player.getInventory().getItemInMainHand();
  if (item == null) return;

  let itemMeta = item.getItemMeta();
  usageCount++;

  let lore = itemMeta.getLore() != null ? itemMeta.getLore().slice(0, -2) : [];
  lore.push("§e║§x§c§2§2§a§f§b开采深度: " + usageCount + "米");
  lore.push('§e╚════════════════════════════════════╝');
  itemMeta.setLore(lore);
  item.setItemMeta(itemMeta);

  let sfItem = getSfItemByItem(item);
  if (sfItem !== null) {
    let drillInfo = drillData[sfItem.getId()];
    if (drillInfo && usageCount >= drillInfo.depth) {
      let randomChance = Math.random();
      usageCount = 0;
      if (randomChance < drillInfo.probability) {
        player.sendMessage("挖到了!");
        let slimefunItem = getSfItemById("BUCKET_OF_OIL");
        //let itemstack = new org.bukkit.inventory.ItemStack(slimefunItem.getItem());
        let itemstack = slimefunItem.getItem().clone();
        player.getWorld().dropItemNaturally(player.getLocation(), itemstack);
      }
    }
  }
}