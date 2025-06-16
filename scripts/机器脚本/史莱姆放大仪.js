var lastRunTime = 0;
var needCharge = 1000; // 每次放大需要的电力

function processEntities(location, charge, machine) {
  let world = location.getWorld();
  let entities = world.getNearbyEntities(location, 10, 10, 10); 
  let slimeCounts = {};

  // 统计每种类型生物的数量
  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Slime || entity instanceof org.bukkit.entity.MagmaCube) {
      let type = entity.getType();
      slimeCounts[type] = (slimeCounts[type] || 0) + 1;
    }
  }

  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Slime || entity instanceof org.bukkit.entity.MagmaCube) {
      let type = entity.getType();
      if (slimeCounts[type] <= 8) {

        let currentSize = entity.getSize();
        if (charge >= needCharge && currentSize < 64) { 
          machine.removeCharge(location, needCharge);
          entity.setSize(currentSize + 1); 
          charge -= needCharge;
        }
      }
    }
  }
}

function tick(info) {
  let currentTime = new Date().getTime();
  if (currentTime - lastRunTime >= 1000) { // 每 10 秒执行一次
    let blockmenu = info.blockMenu();
    if (blockmenu != null) {
      let block = info.block();
      let location = block.getLocation();
      let machine = info.machine();
      let charge = machine.getCharge(location);

      processEntities(location, charge, machine);
    }
    lastRunTime = currentTime;
  }
}