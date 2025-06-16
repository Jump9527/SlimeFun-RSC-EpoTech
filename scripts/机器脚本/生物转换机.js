var lastRunTime = 0;
var needCharge = 1000; // 每次转换需要的电力

// 槽位与生物类型的映射
const SLOT_TO_ENTITY = {
  19: "COW",      // 牛
  20: "SHEEP",    // 羊
  21: "PIG",      // 猪
  22: "CHICKEN",  // 鸡
  23: "HORSE",    // 马
  24: "DONKEY",   // 驴
  25: "RABBIT",   // 兔子
  28: "CAT",      // 猫
  29: "WOLF",     // 狼
  30: "PANDA",     // 熊貓
  31: "PARROT",   // 鹦鹉
  32: "POLAR_BEAR", // 熊
  33: "FOX",      // 狐狸
  34: "BEE"       // 蜜蜂
};

function processEntities(location, charge, machine, entityType) {
  let world = location.getWorld();
  let entities = world.getNearbyEntities(location, 10, 10, 10); // 获取周围10x10x10范围内的实体

  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Ageable) { // 只处理可成长的实体
      if (charge >= needCharge) {
        entity.remove();
        let newEntity = world.spawnEntity(entity.getLocation(), org.bukkit.entity.EntityType[entityType]);

        // 消耗电力
        machine.removeCharge(location, needCharge);
        charge -= needCharge;
      }
    }
  }
}

function onClick(player, slot) {
  if (slot in SLOT_TO_ENTITY) { // 检查是否点击了指定槽位
    const inv = player.getOpenInventory().getTopInventory();
    let location = inv.getHolder().getLocation();
    if (!location) {
      return;
    }

    let machine = StorageCacheUtils.getSfItem(location);
    let charge = machine.getCharge(location);

    if (charge >= needCharge) {
      let entityType = SLOT_TO_ENTITY[slot]; // 获取对应的生物类型
      processEntities(location, charge, machine, entityType);
      player.sendMessage(`已将周围实体转换为 ${entityType}`);
    } else {
      player.sendMessage("电力不足，无法转换实体！");
    }
  } else {
    player.sendMessage("请点击有效的槽位！");
  }
}
