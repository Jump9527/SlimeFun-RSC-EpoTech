function onUse(event) {
  let player = event.getPlayer();
  let world = player.getWorld();
  let location = player.getEyeLocation();
  let launchLocation = location.add(0, 5, 0);
  let targetLocation = player.getTargetBlock(null, 100).getLocation();
  let direction =targetLocation.toVector().subtract(launchLocation.toVector()).normalize();

  for (var i = 0; i < 5; i++) {
    let randomX = launchLocation.getBlockX() + Math.random() * 2 - 1;
    let randomZ = launchLocation.getBlockZ() + Math.random() * 2 - 1;
    let fireballLocation = new org.bukkit.Location(world, randomX, launchLocation.getY(), randomZ);
    let fireball = world.spawn(fireballLocation, org.bukkit.entity.SmallFireball, org.bukkit.event.entity.CreatureSpawnEvent.SpawnReason.CUSTOM);
    fireball.setDirection(direction);
  }
}