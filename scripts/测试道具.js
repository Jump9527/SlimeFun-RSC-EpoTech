function onUse(event) {
  let player = event.getPlayer();
  let block = player.getTargetBlock(null, 10);
  block.setType(org.bukkit.Material.AIR)

  
}