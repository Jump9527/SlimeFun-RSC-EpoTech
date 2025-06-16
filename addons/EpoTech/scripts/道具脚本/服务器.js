function onUse(event) {

  let player = event.getPlayer();
  let hand = event.getHand();

  if(hand !== org.bukkit.inventory.EquipmentSlot.HAND){
    player.sendMessage("主手请持物品");
    return;
  }
  const item = event.getItem();

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
