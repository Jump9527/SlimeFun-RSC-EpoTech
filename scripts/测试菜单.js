function onClick(player, slot) {
  if (slot === 32) {
    const inv = player.getOpenInventory().getTopInventory();
    let location = inv.getHolder().getLocation();
    if(! location) {
      return;
    }
    let charge = io.github.thebusybiscuit.slimefun4.core.attributes.EnergyNetComponent.getCharge(location);
    player.sendMessage(charge);  
    // 遍历容器中的所有物品格
    for (let index = 0; index < inv.getSize(); index++) {
      const item = inv.getItem(index);
      if (item) {
        const type = item.getType();
        const amount = item.getAmount();
        player.sendMessage(`Slot ${index}: ${type} x${amount}`);
      } else {
        player.sendMessage(`Slot ${index}: Empty`);
      }
    }
  } else {
    player.sendMessage("没点到");
  }
}