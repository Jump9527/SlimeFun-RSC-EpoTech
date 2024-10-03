function onUse(event) {
  let player = event.getPlayer();
  let boots = player.getInventory().getHelmet();
  let sfItem = getSfItemByItem(boots);
  //getMaxItemCharge(boots);
  player.sendMessage(sfItem.getItemCharge(boots));
  
}