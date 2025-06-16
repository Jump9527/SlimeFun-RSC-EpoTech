const machineData = new Map();

function processEntities(location, charge, machine) {
  let world = location.getWorld();
  let entities = world.getNearbyEntities(location, 10, 10, 10); 

  for (let entity of entities) {
    if (entity instanceof org.bukkit.entity.Ageable) {
      if (!entity.isAdult()) {
        entity.remove();

        let slimefunItem = getSfItemById("JP_成年礼");
        if (slimefunItem != null) {
          //let itemStack = new org.bukkit.inventory.ItemStack(slimefunItem.getItem());
          let itemStack = slimefunItem.getItem().clone();
          let randomValue = Math.random() * 100;
        
          if (randomValue <= 30) {
            world.dropItemNaturally(location, itemStack);
          } 
        }
        continue;
      }

      const data = machineData.get(location);
      if (charge >= data.needCharge) { 
        machine.removeCharge(location, data.needCharge);
        charge -= data.needCharge;
      }
    }
  }
}

function tick(info) {
  let currentTime = new Date().getTime();
  let block = info.block();

  if (block != null) {
    let location = block.getLocation();
    let machine = info.machine();
    let charge = machine.getCharge(location);

    if (!machineData.has(location)) {
      machineData.set(location, {
        lastRunTime: 0,
        needCharge: 1000
      });
    }
    const data = machineData.get(location);

    if (currentTime - data.lastRunTime >= 1000) {
      processEntities(location, charge, machine);
      data.lastRunTime = currentTime;
    }
  }
}