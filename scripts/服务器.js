function onUse(event) {
  const player = event.getPlayer();
  const item = player.getInventory().getItemInMainHand();
  if( ! handleItemInMainHand(player, "JP_FWQ")){
    player.sendMessage("主手请持物品");
    return;
  }
  const location = player.getLocation();
  item.setAmount(item.getAmount() - 1);
  const radius = 5;
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const targetLocation = new org.bukkit.Location(player.getWorld(), location.getX() + x, location.getY(), location.getZ() + z);
      if (targetLocation.distanceSquared(location) <= radius * radius) {
        targetLocation.getWorld().createExplosion(targetLocation, 1);
      }
    }
  }
}

function handleItemInMainHand(player, slimefunItemId) {
  let itemInMainHand = player.getInventory().getItemInMainHand();
  let sfItem = getSfItemByItem(itemInMainHand);
  if (sfItem !== null) {
    return slimefunItemId === sfItem.getId();
  } else {
    return false;
  }
}