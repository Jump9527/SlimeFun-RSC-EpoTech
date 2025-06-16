function onUse(event) {
  let copyCount = 10; // 设置复制次数
  let player = event.getPlayer();
  let world = player.getWorld();
  let eyeLocation = player.getEyeLocation();
  let direction = eyeLocation.getDirection();
  let notplayer = eyeLocation.add(0, -0.7, 0).add(direction);
  let maxDistance = 100;
  let rayTraceResults = world.rayTrace(notplayer, direction, maxDistance, org.bukkit.FluidCollisionMode.ALWAYS, true, 0, null);

  if (rayTraceResults === null) {
    return;
  }

  let entity = rayTraceResults.getHitEntity();
  if (entity instanceof org.bukkit.entity.Item) {
    let item = entity.getItemStack();
    let newAmount = item.clone();
    newAmount.setAmount(64);

    let location = entity.getLocation();
    for (let i = 0; i < copyCount; i++) {
      world.dropItemNaturally(location, newAmount);
    }
    player.sendMessage("复制成功，共复制了 " + copyCount + " 组物品");
  } else if (entity instanceof org.bukkit.entity.Damageable) {
    let entitytype = entity.getType();
    let spawnReason = org.bukkit.event.entity.CreatureSpawnEvent.SpawnReason.CUSTOM;
    for (let i = 0; i < copyCount; i++) {
      world.spawn(entity.getLocation(), entitytype.getEntityClass(), spawnReason, null);
    }
    player.sendMessage("复制成功，共复制了 " + copyCount + " 个实体");
  }
}