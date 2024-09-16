function onUse(event) {
  let player = event.getPlayer();
  let world = player.getWorld();
  let location = player.getLocation();

  for (let i = 0; i < 3; i++) {
    var monster = world.spawnEntity(location, org.bukkit.entity.EntityType.ZOMBIE);
    monster.setCustomName("回血怪");
    monster.setCustomNameVisible(true);
  }
  runLater(() => {
    if (monster.isValid()) {
        // 怪物存活，为 Boss 回复生命值
        let newHealth  = player.getHealth() + player.getMaxHealth() * 0.1;
        monster.remove(); // 移除怪物
        sendMessage(player, "test");
        //t.cancel();
    }
}, 20); 
//t.cancel();
}