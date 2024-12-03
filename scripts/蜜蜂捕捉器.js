let ItemStack = org.bukkit.inventory.ItemStack;
let Material = org.bukkit.Material;
//安全获取物品
function getItemSafe(item) {
  if (item === null) {
    return new ItemStack(Material.AIR);
  }
  let safeItem = new ItemStack(item.getType());
  safeItem.setAmount(item.getAmount());
  if (item.hasItemMeta()) {
    safeItem.setItemMeta(item.getItemMeta());
  }
  return safeItem;
}
function onUse(event) {
  let player = event.getPlayer();
  let world = player.getWorld();
  let eyeLocation = player.getEyeLocation();
  let direction = eyeLocation.getDirection();
  let startLocation = eyeLocation.clone().subtract(0, 0.8, 0).add(direction);
  let maxDistance = 5;
  let rayTraceResults = world.rayTrace(startLocation, direction, maxDistance, org.bukkit.FluidCollisionMode.ALWAYS, true, 0, null);

  if (rayTraceResults == null) {
    return;
  }

  let entity = rayTraceResults.getHitEntity();
  if (entity instanceof org.bukkit.entity.Bee) {
    let slimefunItem = getSfItemById("JP_BEE");
    let item = getItemSafe(slimefunItem.getItem());
    entity.remove();
    let location = entity.getLocation();
    world.dropItemNaturally(location, item);
  }
}
