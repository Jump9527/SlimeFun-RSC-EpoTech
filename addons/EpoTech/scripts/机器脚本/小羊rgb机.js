function tick(info) {
  let currentTime = new Date().getTime();
  if (currentTime - lastRunTime >= 10) { // 每秒执行一次
    let blockmenu = info.blockMenu();
    if (blockmenu != null) {
      let block = info.block();
      let location = block.getLocation();
      let machine = info.machine();
      let charge = machine.getCharge(location);

      if (charge >= needCharge) { // 检查电力是否足够
        processEntities(location, charge, machine);
        machine.setCharge(location, charge - needCharge); // 扣除电力
      }
    }
    lastRunTime = currentTime;
  }
}

var lastRunTime = 0;
var needCharge = 1000; // 每次转换需要的电力

function processEntities(location, charge, machine) {
  let world = location.getWorld();
  let radius = 10; // 检测半径
  let entities = world.getNearbyEntities(location, radius, radius, radius);

  for (let entity of entities) {
    if (entity.getType() === org.bukkit.entity.EntityType.SHEEP) { // 检测是否为羊
      let sheep = entity;
      let dyeColors = org.bukkit.DyeColor.values(); // 获取所有染料颜色
      let randomColor = dyeColors[Math.floor(Math.random() * dyeColors.length)]; // 随机选择一个颜色

      sheep.setColor(randomColor); // 设置羊的羊毛颜色
    }
  }
}