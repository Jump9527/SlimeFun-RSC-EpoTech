var lastRunTime = 0;
var needCharge = 100;

function processEntities(location, charge, machine) {
  let world = location.getWorld();
  let entities = world.getNearbyEntities(location, 10, 10, 10);
  let animalCounts = {};

  // 统计每种类型生物的数量
  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Animals) {
      let type = entity.getType();
      animalCounts[type] = (animalCounts[type] || 0) + 1;
    }
  }

  // 处理每种类型生物
  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Animals) {
      let type = entity.getType();

      // 如果同类生物数量不超过 8 只
      if (animalCounts[type] <= 8) {
        // 如果未成年且电力足够，设置为成年
        if (!entity.isAdult()) {
          if (charge >= needCharge) {
            machine.removeCharge(location, needCharge);
            entity.setAdult();
            charge -= needCharge;
          } else {
            continue;
          }
        }

        // 如果已经处于繁殖模式，先取消
        if (entity.getLoveModeTicks() > 0) {
          entity.setLoveModeTicks(0);
        }

        // 如果电力足够，设置繁殖模式
        if (charge >= needCharge) {
          machine.removeCharge(location, needCharge);
          entity.setLoveModeTicks(100);
          charge -= needCharge;
        }
      }
    }
  }
}

function tick(info) {
  let currentTime = new Date().getTime();
  if (currentTime - lastRunTime >= 10000) { // 每 10 秒执行一次
    let bm = info.blockMenu();
    if (bm != null) {
      let block = info.block();
      let location = block.getLocation();
      let machine = info.machine();
      let charge = machine.getCharge(location);

      processEntities(location, charge, machine);
    }
    lastRunTime = currentTime;
  }
}