const machineData = new Map();

function tick(info) {
  let currentTime = new Date().getTime();
  let b = info.block();

  if (b != null) {
    let loc = b.getLocation();
    let machine = info.machine();
    let charge = machine.getCharge(loc);

    // 初始化或获取当前机器的数据
    if (!machineData.has(loc)) {
      machineData.set(loc, {
        lastRunTime: 0,
        needCharge: 1000 // 每个机器的 needCharge 可以单独设置
      });
    }
    const data = machineData.get(loc);

    // 检查冷却时间
    if (currentTime - data.lastRunTime >= 8000) { // 每 8 秒执行一次
      if (charge < data.needCharge) {
        return;
      }

      let world = loc.getWorld();
      let entities = world.getNearbyEntities(loc, 50, 50, 50);

      for (let entity of entities) {
        if (entity instanceof org.bukkit.entity.Player) { 
          let player = entity;
          let playerLoc = player.getLocation();
          let blockBelow = playerLoc.clone().subtract(0, 1, 0).getBlock();
          let velocity = player.getVelocity();
          let verticalVelocity = velocity.getY();

          if (blockBelow.getType() === org.bukkit.Material.AIR && verticalVelocity <= 0) {
            player.setHealth(0); 
            org.bukkit.Bukkit.broadcastMessage(player.getName() + "§c 玩家被击落");

            let slimefunItem = getSfItemById("JP_科比残骸");
            if (slimefunItem != null) {
              //let itemStack = new org.bukkit.inventory.ItemStack(slimefunItem.getItem());
              let itemStack = slimefunItem.getItem().clone();
              let randomValue = Math.random() * 100; // 生成0到100的随机浮点数
            
              // 如果随机值小于或等于物品的概率，则掉落该物品
              if (randomValue <= 30) {
                world.dropItemNaturally(loc, itemStack);
              } 
            }

            machine.removeCharge(loc, data.needCharge); 
          }
        }
      }

      // 更新当前机器的 lastRunTime
      data.lastRunTime = currentTime;
    }
  }
}