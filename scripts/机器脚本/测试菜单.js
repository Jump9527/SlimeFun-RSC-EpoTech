function onClick(player, slot) {
  if (slot === 32) {
    const inv = player.getOpenInventory().getTopInventory();
    let location = inv.getHolder().getLocation();
    if(! location) {
      player.sendMessage("出问题了");
      return;
    }
    let b = StorageCacheUtils.getSfItem(location);
    let charge = b.getCharge(location);
    player.sendMessage(charge);  
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