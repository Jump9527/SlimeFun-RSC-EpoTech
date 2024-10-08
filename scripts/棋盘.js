var range = 30;
var Type = org.bukkit.Material.WHITE_STAINED_GLASS;

var white = org.bukkit.Material.ACACIA_BUTTON;
var black = org.bukkit.Material.POLISHED_BLACKSTONE_BUTTON;

function placeAndRemoval(event, range, delay) {
  let block = event.getBlock();
  let location = block.getLocation();
  let world = block.getWorld();

  place(location, world, Type, range);

  //runLater(() => remove(location, world, Type, white, black, range), delay);
}

function place(location, world, Type, range) {
  for (let x = -range; x <= range; x++) {
    for (let z = -range; z <= range; z++) {
      let blockLocation = location.clone().add(x, 0, z);
      if (world.getBlockAt(blockLocation).getType() === org.bukkit.Material.AIR) {
        world.getBlockAt(blockLocation).setType(Type);
      }
    }
  }
}

function remove(location, world, Type, range) {
  for (let x = -range; x <= range; x++) {
    for (let z = -range; z <= range; z++) {
      let blockLocation = location.clone().add(x, 0, z);
      if (world.getBlockAt(blockLocation).getType() === Type) {
        world.getBlockAt(blockLocation).setType(org.bukkit.Material.AIR);
      }
    }
  }
}

function removeBUTTON(location, world, white, black, range) {
  for (let x = -range; x <= range; x++) {
    for (let z = -range; z <= range; z++) {
      for (let y = 0; y <= 2; y++){
        let blockLocation = location.clone().add(x, y, z);
        if ( world.getBlockAt(blockLocation).getType() === white || 
            world.getBlockAt(blockLocation).getType() === black) {
          world.getBlockAt(blockLocation).setType(org.bukkit.Material.AIR);
        }
      }
    }
  }
}

function onPlace(event) {
  if(event.getPlayer() instanceof org.bukkit.entity.Player){
    placeAndRemoval(event, range, 400);
  }
}

function onBreak(event) {
  let block = event.getBlock();
  let location = block.getLocation();
  let world = block.getWorld();
  removeBUTTON(location, world, white, black, range);
  runLater(() => remove(location, world, Type, range), 20);
}