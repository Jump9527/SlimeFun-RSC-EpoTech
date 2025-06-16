function onUse(event) {
  let player = event.getPlayer();
  if(event.getHand() !== org.bukkit.inventory.EquipmentSlot.HAND){
    player.sendMessage("主手请持物品");
    return;
  }

  let item = event.getItem();
  item.setAmount(item.getAmount() - 1);
  
  let block = player.getTargetBlock(null, 5);
  let location = block.getLocation().add(0, 1, 0); 
  let world = location.getWorld();

  world.spawnEntity(location, org.bukkit.entity.EntityType.VILLAGER);
  
}